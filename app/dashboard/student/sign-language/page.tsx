"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"
import { HandIcon } from "@/components/icons"

const GESTURE_MAP: Record<string, string> = {
  thumbs_up: "Great job! / Yes",
  thumbs_down: "No / Incorrect",
  peace: "Hello / Peace",
  fist: "Stop / Wait",
  open_palm: "Hi / Five",
  pointing: "Look / That",
}

export default function SignLanguagePage() {
  const router = useRouter()
  const { user } = useUser()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [detectedGesture, setDetectedGesture] = useState<string | null>(null)
  const [gestureHistory, setGestureHistory] = useState<string[]>([])

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setCameraActive(false)
    }
  }, [])

  // Simulate gesture detection (in production, use MediaPipe or TensorFlow.js)
  const simulateGestureDetection = () => {
    const gestures = Object.keys(GESTURE_MAP)
    const randomGesture = gestures[Math.floor(Math.random() * gestures.length)]
    setDetectedGesture(randomGesture)
    setGestureHistory((prev) => [randomGesture, ...prev].slice(0, 10))
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (cameraActive) {
      interval = setInterval(simulateGestureDetection, 3000)
    }
    return () => clearInterval(interval)
  }, [cameraActive])

  useEffect(() => {
    return () => stopCamera()
  }, [stopCamera])

  if (!user || user.role !== "student") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            className={`px-3 py-1 rounded-full text-sm font-medium ${cameraActive ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}
          >
            {cameraActive ? "Camera Active" : "Camera Off"}
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Camera Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Camera Feed</CardTitle>
              <CardDescription>Show your hand gestures to the camera</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-muted-foreground">Camera is off</p>
                  </div>
                )}
                {detectedGesture && cameraActive && (
                  <div className="absolute bottom-4 left-4 right-4 p-3 bg-background/90 backdrop-blur rounded-lg">
                    <p className="text-sm text-muted-foreground">Detected:</p>
                    <p className="font-bold text-foreground capitalize">{detectedGesture.replace("_", " ")}</p>
                    <p className="text-sm text-primary">{GESTURE_MAP[detectedGesture]}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={cameraActive ? stopCamera : startCamera}
                  className={`flex-1 ${cameraActive ? "bg-red-500 hover:bg-red-600" : "bg-accent hover:bg-accent/90"}`}
                >
                  {cameraActive ? "Stop Camera" : "Start Camera"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Gesture Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Gesture Guide</CardTitle>
              <CardDescription>Common gestures and their meanings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(GESTURE_MAP).map(([gesture, meaning]) => (
                  <div
                    key={gesture}
                    className={`p-3 rounded-lg border transition-colors ${detectedGesture === gesture ? "border-accent bg-accent/10" : "border-border"}`}
                  >
                    <p className="font-semibold capitalize">{gesture.replace("_", " ")}</p>
                    <p className="text-sm text-muted-foreground">{meaning}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* History */}
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
