"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useUser } from "@/lib/user-context"

interface HandLandmark {
  x: number
  y: number
}

export default function AirDrawingPage() {
  const router = useRouter()
  const { user } = useUser()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [isTracking, setIsTracking] = useState(false)
  const [brushSize, setBrushSize] = useState(8)
  const [brushColor, setBrushColor] = useState("#3B82F6")
  const [showLandmarks, setShowLandmarks] = useState(true)
  const [gestureMode, setGestureMode] = useState<"draw" | "erase" | "none">("none")
  const [handDetected, setHandDetected] = useState(false)
  const [libraryLoading, setLibraryLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const lastPosRef = useRef({ x: 0, y: 0 })
  const isDrawingRef = useRef(false)
  const modelRef = useRef<any>(null)

  const colors = ["#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#000000", "#FFFFFF"]

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [user, router])

  const detectGesture = useCallback((indexTip: HandLandmark, middleExtended: boolean): "draw" | "erase" | "none" => {
    // Single finger up = draw, two fingers up = erase, all down = none
    if (indexTip && middleExtended === false) {
      return "draw"
    } else if (indexTip && middleExtended === true) {
      return "erase"
    }
    return "none"
  }, [])

  const initializeHandTracking = useCallback(async () => {
    if (typeof window === "undefined") return

    try {
      setLibraryLoading(true)
      setErrorMessage("")

      // Load TensorFlow.js
      const tfScript = document.createElement("script")
      tfScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"
      tfScript.async = true

      await new Promise<void>((resolve, reject) => {
        tfScript.onload = () => resolve()
        tfScript.onerror = () => reject(new Error("Failed to load TensorFlow"))
        document.head.appendChild(tfScript)
      })

      // Load Handpose model
      const handposeScript = document.createElement("script")
      handposeScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose"
      handposeScript.async = true

      await new Promise<void>((resolve, reject) => {
        handposeScript.onload = () => resolve()
        handposeScript.onerror = () => reject(new Error("Failed to load Handpose"))
        document.head.appendChild(handposeScript)
      })

      const tf = (window as any).tf
      const handpose = (window as any).handpose

      if (!tf || !handpose) {
        throw new Error("TensorFlow or Handpose not loaded")
      }

      const model = await handpose.load()
      modelRef.current = model
      setLibraryLoading(false)
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to initialize hand tracking")
      setLibraryLoading(false)
    }
  }, [])

  const detectHands = useCallback(async () => {
    if (!modelRef.current || !videoRef.current || !canvasRef.current || !overlayCanvasRef.current || !isTracking) {
      return
    }

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const overlayCanvas = overlayCanvasRef.current
      const ctx = canvas.getContext("2d")
      const overlayCtx = overlayCanvas.getContext("2d")

      if (!ctx || !overlayCtx) return

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)

      const predictions = await modelRef.current.estimateHands(video)

      if (predictions && predictions.length > 0) {
        setHandDetected(true)
        const hand = predictions[0]

        if (hand.landmarks && hand.landmarks.length >= 21) {
          const landmarks = hand.landmarks

          // Index finger tip is landmark 8
          const indexTip = { x: landmarks[8][0], y: landmarks[8][1] }
          // Middle finger tip is landmark 12
          const middleTip = { x: landmarks[12][0], y: landmarks[12][1] }
          // Ring finger tip is landmark 16
          const ringTip = { x: landmarks[16][0], y: landmarks[16][1] }

          const middleExtended = middleTip.y < landmarks[9][1]
          const ringExtended = ringTip.y < landmarks[13][1]

          const gesture = detectGesture(indexTip, middleExtended && ringExtended)
          setGestureMode(gesture)

          // Draw landmarks
          if (showLandmarks) {
            landmarks.forEach((landmark: number[], index: number) => {
              overlayCtx.beginPath()
              overlayCtx.arc(landmark[0], landmark[1], index === 8 ? 8 : 4, 0, Math.PI * 2)
              overlayCtx.fillStyle = index === 8 ? (gesture === "draw" ? "#22C55E" : "#EF4444") : "#FFF"
              overlayCtx.fill()
              overlayCtx.strokeStyle = "#000"
              overlayCtx.lineWidth = 1
              overlayCtx.stroke()
            })
          }

          // Draw cursor circle
          overlayCtx.beginPath()
          overlayCtx.arc(indexTip.x, indexTip.y, brushSize + 5, 0, Math.PI * 2)
          overlayCtx.strokeStyle = gesture === "draw" ? brushColor : gesture === "erase" ? "#EF4444" : "#888"
          overlayCtx.lineWidth = 2
          overlayCtx.stroke()

          // Handle drawing
          if (gesture === "draw") {
            if (isDrawingRef.current) {
              const drawCtx = canvas.getContext("2d")
              if (drawCtx) {
                drawCtx.beginPath()
                drawCtx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
                drawCtx.lineTo(indexTip.x, indexTip.y)
                drawCtx.strokeStyle = brushColor
                drawCtx.lineWidth = brushSize
                drawCtx.lineCap = "round"
                drawCtx.lineJoin = "round"
                drawCtx.stroke()
              }
            }
            isDrawingRef.current = true
            lastPosRef.current = { x: indexTip.x, y: indexTip.y }
          } else if (gesture === "erase") {
            const drawCtx = canvas.getContext("2d")
            if (drawCtx) {
              drawCtx.clearRect(indexTip.x - brushSize * 2, indexTip.y - brushSize * 2, brushSize * 4, brushSize * 4)
            }
            isDrawingRef.current = false
          } else {
            isDrawingRef.current = false
          }
        }
      } else {
        setHandDetected(false)
        setGestureMode("none")
        isDrawingRef.current = false
      }

      animationFrameRef.current = requestAnimationFrame(detectHands)
    } catch (error) {
      console.error("[v0] Detection error:", error)
      animationFrameRef.current = requestAnimationFrame(detectHands)
    }
  }, [isTracking, brushSize, brushColor, showLandmarks, detectGesture])

  const startCamera = useCallback(async () => {
    if (!videoRef.current) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      })
      videoRef.current.srcObject = stream
      setCameraActive(true)

      videoRef.current.onloadedmetadata = () => {
        if (canvasRef.current && overlayCanvasRef.current) {
          canvasRef.current.width = videoRef.current?.videoWidth || 640
          canvasRef.current.height = videoRef.current?.videoHeight || 480
          overlayCanvasRef.current.width = videoRef.current?.videoWidth || 640
          overlayCanvasRef.current.height = videoRef.current?.videoHeight || 480
        }
        initializeHandTracking()
      }
    } catch (error) {
      console.error("[v0] Camera error:", error)
      setErrorMessage("Unable to access camera. Please check permissions.")
    }
  }, [initializeHandTracking])

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      setCameraActive(false)
      setIsTracking(false)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }

  const downloadDrawing = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.href = canvasRef.current.toDataURL("image/png")
      link.download = `air-drawing-${Date.now()}.png`
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Air Drawing Studio</h1>
          <Link href="/dashboard/student">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {errorMessage && (
          <Card className="mb-4 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700">{errorMessage}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Drawing Canvas</CardTitle>
                <CardDescription>
                  {libraryLoading
                    ? "Loading hand tracking..."
                    : handDetected
                      ? "Hand detected! Use your index finger to draw"
                      : "Point index finger to draw, two fingers to erase"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-white rounded-lg overflow-hidden" style={{ aspect: "4/3" }}>
                  <video ref={videoRef} className="hidden" autoPlay playsInline />
                  <canvas ref={canvasRef} className="w-full h-full cursor-crosshair bg-white" />
                  <canvas ref={overlayCanvasRef} className="absolute inset-0 w-full h-full" />

                  {!cameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">Camera is off</p>
                        <Button onClick={startCamera} disabled={libraryLoading}>
                          {libraryLoading ? "Initializing..." : "Start Camera"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button onClick={cameraActive ? stopCamera : startCamera} disabled={libraryLoading}>
                    {cameraActive ? "Stop Camera" : "Start Camera"}
                  </Button>
                  <Button onClick={clearCanvas} variant="outline">
                    Clear Canvas
                  </Button>
                  <Button onClick={downloadDrawing} variant="outline">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">Brush Size</Label>
                  <Slider value={[brushSize]} onValueChange={(val) => setBrushSize(val[0])} min={2} max={50} step={1} />
                  <p className="text-xs text-gray-600 mt-1">{brushSize}px</p>
                </div>

                <div>
                  <Label className="text-sm mb-2 block">Brush Color</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        className={`w-full h-8 rounded border-2 ${brushColor === color ? "border-gray-800" : "border-gray-300"}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setBrushColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Show Hand Landmarks</Label>
                    <Switch checked={showLandmarks} onCheckedChange={setShowLandmarks} />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Gesture Info:</p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>Index up: Draw</p>
                    <p>Index + Middle up: Erase</p>
                    <p>All fingers down: Pause</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs font-bold text-blue-600">
                    Status: {handDetected ? "Hand Detected ✓" : "No Hand Detected"}
                  </p>
                  <p className="text-xs font-bold text-blue-600">Mode: {gestureMode.toUpperCase()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
