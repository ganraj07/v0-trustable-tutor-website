"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useUser } from "@/lib/user-context"
import { DrawIcon } from "@/components/icons"

interface HandLandmark {
  x: number
  y: number
  z: number
}

export default function AirDrawingPage() {
  const router = useRouter()
  const { user } = useUser()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  const [cameraActive, setCameraActive] = useState(false)
  const [isTracking, setIsTracking] = useState(false)
  const [brushSize, setBrushSize] = useState(8)
  const [brushColor, setBrushColor] = useState("#3B82F6")
  const [showLandmarks, setShowLandmarks] = useState(true)
  const [gestureMode, setGestureMode] = useState<"draw" | "erase" | "none">("none")
  const [handDetected, setHandDetected] = useState(false)
  const [fingerPositions, setFingerPositions] = useState<{ index: { x: number; y: number } | null }>({ index: null })

  const lastPosRef = useRef({ x: 0, y: 0 })
  const isDrawingRef = useRef(false)
  const handsRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)

  const colors = ["#3B82F6", "#EF4444", "#22C55E", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#000000", "#FFFFFF"]

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  // Calculate distance between two points
  const getDistance = (p1: HandLandmark, p2: HandLandmark) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
  }

  // Detect gestures from hand landmarks
  const detectGesture = useCallback((landmarks: HandLandmark[]): "draw" | "erase" | "none" => {
    if (!landmarks || landmarks.length < 21) return "none"

    // Finger tip indices: thumb=4, index=8, middle=12, ring=16, pinky=20
    // Finger MCP indices: thumb=2, index=5, middle=9, ring=13, pinky=17

    const indexTip = landmarks[8]
    const indexMcp = landmarks[5]
    const middleTip = landmarks[12]
    const middleMcp = landmarks[9]
    const ringTip = landmarks[16]
    const ringMcp = landmarks[13]
    const pinkyTip = landmarks[20]
    const pinkyMcp = landmarks[17]
    const thumbTip = landmarks[4]

    // Check if finger is extended (tip is above MCP in y-axis, since y is inverted)
    const indexExtended = indexTip.y < indexMcp.y
    const middleExtended = middleTip.y < middleMcp.y
    const ringExtended = ringTip.y < ringMcp.y
    const pinkyExtended = pinkyTip.y < pinkyMcp.y

    // Drawing gesture: only index finger extended (pointing)
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return "draw"
    }

    // Erase gesture: index and middle fingers extended (peace sign)
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
      return "erase"
    }

    // All fingers extended = pause/none
    if (indexExtended && middleExtended && ringExtended && pinkyExtended) {
      return "none"
    }

    return "none"
  }, [])

  // Process hand landmarks and draw
  const onResults = useCallback(
    (results: any) => {
      if (!overlayCanvasRef.current || !canvasRef.current) return

      const overlayCtx = overlayCanvasRef.current.getContext("2d")
      const drawCtx = canvasRef.current.getContext("2d")
      if (!overlayCtx || !drawCtx) return

      // Clear overlay canvas
      overlayCtx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height)

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        setHandDetected(true)
        const landmarks = results.multiHandLandmarks[0]

        // Detect gesture
        const gesture = detectGesture(landmarks)
        setGestureMode(gesture)

        // Get index finger tip position
        const indexTip = landmarks[8]
        const canvasWidth = canvasRef.current.width
        const canvasHeight = canvasRef.current.height

        // Mirror the x coordinate and scale to canvas
        const x = (1 - indexTip.x) * canvasWidth
        const y = indexTip.y * canvasHeight

        setFingerPositions({ index: { x, y } })

        // Draw hand landmarks on overlay
        if (showLandmarks) {
          // Draw connections
          const connections = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4], // Thumb
            [0, 5],
            [5, 6],
            [6, 7],
            [7, 8], // Index
            [0, 9],
            [9, 10],
            [10, 11],
            [11, 12], // Middle
            [0, 13],
            [13, 14],
            [14, 15],
            [15, 16], // Ring
            [0, 17],
            [17, 18],
            [18, 19],
            [19, 20], // Pinky
            [5, 9],
            [9, 13],
            [13, 17], // Palm
          ]

          overlayCtx.strokeStyle = gesture === "draw" ? "#22C55E" : gesture === "erase" ? "#EF4444" : "#3B82F6"
          overlayCtx.lineWidth = 2

          connections.forEach(([start, end]) => {
            const startPoint = landmarks[start]
            const endPoint = landmarks[end]
            overlayCtx.beginPath()
            overlayCtx.moveTo((1 - startPoint.x) * canvasWidth, startPoint.y * canvasHeight)
            overlayCtx.lineTo((1 - endPoint.x) * canvasWidth, endPoint.y * canvasHeight)
            overlayCtx.stroke()
          })

          // Draw landmarks
          landmarks.forEach((landmark: HandLandmark, index: number) => {
            const lx = (1 - landmark.x) * canvasWidth
            const ly = landmark.y * canvasHeight

            overlayCtx.beginPath()
            overlayCtx.arc(lx, ly, index === 8 ? 8 : 4, 0, Math.PI * 2)
            overlayCtx.fillStyle = index === 8 ? (gesture === "draw" ? "#22C55E" : "#EF4444") : "#FFF"
            overlayCtx.fill()
            overlayCtx.strokeStyle = "#000"
            overlayCtx.lineWidth = 1
            overlayCtx.stroke()
          })
        }

        // Draw cursor indicator
        overlayCtx.beginPath()
        overlayCtx.arc(x, y, brushSize + 5, 0, Math.PI * 2)
        overlayCtx.strokeStyle = gesture === "draw" ? brushColor : gesture === "erase" ? "#EF4444" : "#888"
        overlayCtx.lineWidth = 2
        overlayCtx.stroke()

        // Perform drawing or erasing
        if (gesture === "draw") {
          if (isDrawingRef.current) {
            drawCtx.beginPath()
            drawCtx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
            drawCtx.lineTo(x, y)
            drawCtx.strokeStyle = brushColor
            drawCtx.lineWidth = brushSize
            drawCtx.lineCap = "round"
            drawCtx.lineJoin = "round"
            drawCtx.stroke()
          }
          isDrawingRef.current = true
          lastPosRef.current = { x, y }
        } else if (gesture === "erase") {
          drawCtx.beginPath()
          drawCtx.arc(x, y, brushSize * 2, 0, Math.PI * 2)
          drawCtx.fillStyle = "#FFFFFF"
          drawCtx.fill()
          isDrawingRef.current = false
        } else {
          isDrawingRef.current = false
        }
      } else {
        setHandDetected(false)
        setGestureMode("none")
        setFingerPositions({ index: null })
        isDrawingRef.current = false
      }
    },
    [brushColor, brushSize, showLandmarks, detectGesture],
  )

  // Initialize MediaPipe Hands
  const initializeHandTracking = useCallback(async () => {
    if (typeof window === "undefined") return

    try {
      // Dynamically import MediaPipe
      const { Hands } = await import("@mediapipe/hands")
      const { Camera } = await import("@mediapipe/camera_utils")

      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        },
      })

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5,
      })

      hands.onResults(onResults)
      handsRef.current = hands

      if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (handsRef.current && videoRef.current) {
              await handsRef.current.send({ image: videoRef.current })
            }
          },
          width: 640,
          height: 480,
        })
        cameraRef.current = camera
        await camera.start()
        setCameraActive(true)
        setIsTracking(true)
      }
    } catch (error) {
      console.error("Error initializing hand tracking:", error)
    }
  }, [onResults])

  const startCamera = useCallback(async () => {
    await initializeHandTracking()
  }, [initializeHandTracking])

  const stopCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop()
      cameraRef.current = null
    }
    if (handsRef.current) {
      handsRef.current.close()
      handsRef.current = null
    }
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
    setIsTracking(false)
    setHandDetected(false)
    isDrawingRef.current = false
  }, [])

  // Mouse/touch drawing fallback
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (cameraActive) return
    isDrawingRef.current = true
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      lastPosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current || cameraActive) return

    const ctx = canvasRef.current.getContext("2d")
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y)
      ctx.lineTo(x, y)
      ctx.strokeStyle = brushColor
      ctx.lineWidth = brushSize
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
      lastPosRef.current = { x, y }
    }
  }

  const handleCanvasMouseUp = () => {
    isDrawingRef.current = false
  }

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx && canvasRef.current) {
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  const saveDrawing = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = "air-drawing.png"
    link.href = canvasRef.current.toDataURL()
    link.click()
  }

  // Initialize canvas with white background
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      stopCamera()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [stopCamera])

  if (!user || user.role !== "student") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/student" className="p-2 rounded-lg hover:bg-muted transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <DrawIcon className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">AI Air Drawing</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {handDetected && (
              <span className="px-3 py-1 bg-green-500/20 text-green-500 text-sm rounded-full font-medium">
                Hand Detected
              </span>
            )}
            <span
              className={`px-3 py-1 text-sm rounded-full font-medium ${
                gestureMode === "draw"
                  ? "bg-green-500/20 text-green-500"
                  : gestureMode === "erase"
                    ? "bg-red-500/20 text-red-500"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {gestureMode === "draw" ? "Drawing" : gestureMode === "erase" ? "Erasing" : "Idle"}
            </span>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Camera Feed */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Camera View</CardTitle>
              <CardDescription>Your hand controls the brush</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
                    <svg
                      className="w-12 h-12 text-muted-foreground mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-muted-foreground text-sm text-center px-4">Enable camera for hand tracking</p>
                  </div>
                )}
              </div>
              <Button
                onClick={cameraActive ? stopCamera : startCamera}
                className={`w-full ${cameraActive ? "bg-red-500 hover:bg-red-600" : ""}`}
              >
                {cameraActive ? "Stop Camera" : "Enable Hand Tracking"}
              </Button>

              {/* Gesture Guide */}
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <p className="text-sm font-medium">Gesture Guide:</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    Point index finger = Draw
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    Peace sign (2 fingers) = Erase
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Open hand = Pause
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="landmarks" className="text-sm">
                  Show Hand Skeleton
                </Label>
                <Switch id="landmarks" checked={showLandmarks} onCheckedChange={setShowLandmarks} />
              </div>
            </CardContent>
          </Card>

          {/* Drawing Canvas */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Drawing Canvas</CardTitle>
              <CardDescription>
                {cameraActive
                  ? "Draw in the air with your index finger!"
                  : "Use mouse/touch to draw, or enable camera for hand tracking"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full border border-border rounded-xl bg-white cursor-crosshair"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
                {/* Overlay canvas for hand landmarks */}
                <canvas
                  ref={overlayCanvasRef}
                  width={800}
                  height={500}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
                {/* Finger position indicator when tracking */}
                {fingerPositions.index && cameraActive && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: `${(fingerPositions.index.x / 800) * 100}%`,
                      top: `${(fingerPositions.index.y / 500) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className={`w-4 h-4 rounded-full animate-ping ${
                        gestureMode === "draw" ? "bg-green-500" : gestureMode === "erase" ? "bg-red-500" : "bg-blue-500"
                      }`}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tools */}
          <Card className="lg:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Drawing Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-6">
                {/* Colors */}
                <div className="space-y-2">
                  <Label>Brush Color</Label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setBrushColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          brushColor === color ? "scale-125 border-foreground" : "border-transparent"
                        } ${color === "#FFFFFF" ? "border border-gray-300" : ""}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      className="w-8 h-8 rounded-full cursor-pointer"
                    />
                  </div>
                </div>

                {/* Brush Size */}
                <div className="space-y-2 flex-1 min-w-[200px]">
                  <Label>Brush Size: {brushSize}px</Label>
                  <Slider value={[brushSize]} onValueChange={([v]) => setBrushSize(v)} min={2} max={30} step={1} />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="outline" onClick={clearCanvas}>
                    Clear Canvas
                  </Button>
                  <Button onClick={saveDrawing}>Save Drawing</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
