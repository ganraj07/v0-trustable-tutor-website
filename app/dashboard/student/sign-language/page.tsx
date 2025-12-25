"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"
import { HandIcon } from "@/components/icons"

const GESTURE_MAP: Record<string, string> = {
  victory: "Victory / Peace / 2",
  thumbs_up: "Great job! / Yes",
  thumbs_down: "No / Incorrect",
  open_palm: "Hi / Five / Stop",
  pointing_up: "Look up / Attention",
  ok_sign: "OK / Perfect",
  fist: "Stop / Wait / Rock",
  call_me: "Call me / Contact",
}

export default function SignLanguagePage() {
  const router = useRouter()
  const { user } = useUser()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null)
  const [gestureHistory, setGestureHistory] = useState<string[]>([])
  const [confidence, setConfidence] = useState(0)
  const [libraryLoading, setLibraryLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const modelRef = useRef<any>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  const detectGestureFromLandmarks = (landmarks: any[]): { gesture: string; confidence: number } => {
    if (!landmarks || landmarks.length < 21) {
      return { gesture: "unknown", confidence: 0 }
    }

    // Key landmarks
    const wrist = landmarks[0]
    const thumbTip = landmarks[4]
    const indexTip = landmarks[8]
    const middleTip = landmarks[12]
    const ringTip = landmarks[16]
    const pinkyTip = landmarks[20]

    const thumbBase = landmarks[2]
    const indexBase = landmarks[6]
    const middleBase = landmarks[10]
    const ringBase = landmarks[14]
    const pinkyBase = landmarks[18]

    // Helper function to check if finger is extended
    const isFingerExtended = (tip: any, base: any, palmBase: any) => {
      return tip.y < base.y && Math.abs(tip.x - base.x) < Math.abs(base.x - palmBase.x) * 0.5
    }

    // Helper function for distance
    const distance = (p1: any, p2: any) => {
      return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
    }

    const thumbExt = isFingerExtended(thumbTip, thumbBase, wrist)
    const indexExt = isFingerExtended(indexTip, indexBase, wrist)
    const middleExt = isFingerExtended(middleTip, middleBase, wrist)
    const ringExt = isFingerExtended(ringTip, ringBase, wrist)
    const pinkyExt = isFingerExtended(pinkyTip, pinkyBase, wrist)

    // Gesture detection logic
    if (thumbExt && indexExt && !middleExt && !ringExt && !pinkyExt) {
      return { gesture: "victory", confidence: 0.9 }
    } else if (thumbExt && !indexExt && !middleExt && !ringExt && !pinkyExt) {
      const dist = distance(thumbTip, indexBase)
      if (dist < 0.1) {
        return { gesture: "ok_sign", confidence: 0.85 }
      }
      return { gesture: "thumbs_up", confidence: 0.9 }
    } else if (indexExt && !thumbExt && !middleExt && !ringExt && !pinkyExt) {
      return { gesture: "pointing_up", confidence: 0.88 }
    } else if (indexExt && middleExt && !thumbExt && !ringExt && !pinkyExt) {
      return { gesture: "call_me", confidence: 0.85 }
    } else if (thumbExt && indexExt && middleExt && ringExt && pinkyExt) {
      return { gesture: "open_palm", confidence: 0.92 }
    } else if (!thumbExt && !indexExt && !middleExt && !ringExt && !pinkyExt) {
      return { gesture: "fist", confidence: 0.9 }
    }

    return { gesture: "unknown", confidence: 0 }
  }

  const startCamera = useCallback(async () => {
    if (!videoRef.current) return

    try {
      setLibraryLoading(true)
      setError("")

      // Get camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 } },
      })
      videoRef.current.srcObject = stream
      setCameraActive(true)

      // Load TensorFlow and Handpose
      const tfScript = document.createElement("script")
      tfScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"
      tfScript.async = true

      await new Promise<void>((resolve, reject) => {
        tfScript.onload = () => resolve()
        tfScript.onerror = () => reject(new Error("Failed to load TensorFlow"))
        document.head.appendChild(tfScript)
      })

      const handposeScript = document.createElement("script")
      handposeScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose"
      handposeScript.async = true

      await new Promise<void>((resolve, reject) => {
        handposeScript.onload = () => resolve()
        handposeScript.onerror = () => reject(new Error("Failed to load Handpose"))
        document.head.appendChild(handposeScript)
      })

      const handpose = (window as any).handpose
      if (!handpose) throw new Error("Handpose not loaded")

      const model = await handpose.load()
      modelRef.current = model
      setLibraryLoading(false)

      // Start detection loop
      detectGestures()
    } catch (err: any) {
      console.error("[v0] Camera error:", err)
      setError(err.message || "Failed to access camera. Check permissions.")
      setLibraryLoading(false)
    }
  }, [])

  const detectGestures = useCallback(async () => {
    if (!modelRef.current || !videoRef.current || !cameraActive) return

    try {
      const predictions = await modelRef.current.estimateHands(videoRef.current)

      if (predictions && predictions.length > 0) {
        const hand = predictions[0]
        if (hand.landmarks) {
          const { gesture, confidence: conf } = detectGestureFromLandmarks(hand.landmarks)
          setConfidence(conf)

          if (gesture !== "unknown" && conf > 0.7) {
            setDetectedGesture(gesture)
            setGestureHistory((prev) => [gesture, ...prev].slice(0, 10))
          } else {
            setDetectedGesture(null)
          }

          // Draw landmarks
          if (canvasRef.current && videoRef.current) {
            const ctx = canvasRef.current.getContext("2d")
            if (ctx) {
              canvasRef.current.width = videoRef.current.videoWidth
              canvasRef.current.height = videoRef.current.videoHeight
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

              hand.landmarks.forEach((landmark: number[], idx: number) => {
                ctx.beginPath()
                ctx.arc(landmark[0], landmark[1], idx === 0 ? 6 : 3, 0, Math.PI * 2)
                ctx.fillStyle = idx === 8 ? "#22C55E" : "#3B82F6"
                ctx.fill()
              })
            }
          }
        }
      } else {
        setDetectedGesture(null)
        setConfidence(0)
      }

      animationRef.current = requestAnimationFrame(detectGestures)
    } catch (err) {
      console.error("[v0] Detection error:", err)
      animationRef.current = requestAnimationFrame(detectGestures)
    }
  }, [cameraActive])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

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
              <HandIcon className="w-6 h-6 text-accent" />
              <span className="font-bold text-lg">Sign Language Recognition</span>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              cameraActive ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"
            }`}
          >
            {cameraActive ? "Camera Active" : "Camera Off"}
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-5xl mx-auto">
        {error && (
          <Card className="mb-4 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-700 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Camera Feed</CardTitle>
              <CardDescription>Show your hand gestures to the camera</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-white font-semibold">Camera is off</p>
                  </div>
                )}

                {detectedGesture && cameraActive && (
                  <div className="absolute bottom-4 left-4 right-4 p-3 bg-background/90 backdrop-blur rounded-lg">
                    <p className="text-sm text-muted-foreground">Detected:</p>
                    <p className="font-bold text-foreground capitalize">{detectedGesture.replace("_", " ")}</p>
                    <p className="text-sm text-primary">{GESTURE_MAP[detectedGesture]}</p>
                    <p className="text-xs text-muted-foreground mt-1">Confidence: {(confidence * 100).toFixed(0)}%</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={cameraActive ? stopCamera : startCamera}
                  disabled={libraryLoading}
                  className={`flex-1 ${cameraActive ? "bg-red-500 hover:bg-red-600" : "bg-accent hover:bg-accent/90"}`}
                >
                  {libraryLoading ? "Loading..." : cameraActive ? "Stop Camera" : "Start Camera"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gesture Guide</CardTitle>
              <CardDescription>Common gestures and their meanings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {Object.entries(GESTURE_MAP).map(([gesture, meaning]) => (
                  <div
                    key={gesture}
                    className={`p-3 rounded-lg border transition-colors ${
                      detectedGesture === gesture ? "border-accent bg-accent/10" : "border-border"
                    }`}
                  >
                    <p className="font-semibold capitalize">{gesture.replace("_", " ")}</p>
                    <p className="text-sm text-muted-foreground">{meaning}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recognition History</CardTitle>
              <CardDescription>Recently detected gestures</CardDescription>
            </CardHeader>
            <CardContent>
              {gestureHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No gestures detected yet. Start the camera and show your hands!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {gestureHistory.map((gesture, index) => (
                    <span key={index} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm capitalize">
                      {gesture.replace("_", " ")}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
