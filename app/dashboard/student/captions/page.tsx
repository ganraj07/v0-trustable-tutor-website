"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useUser } from "@/lib/user-context"
import { CaptionsIcon } from "@/components/icons"
import SpeechRecognition from "speech-recognition"

export default function LiveCaptionsPage() {
  const router = useRouter()
  const { user, updateAccessibilityPreferences } = useUser()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState<string[]>([])
  const [currentText, setCurrentText] = useState("")
  const [fontSize, setFontSize] = useState(18)
  const [showTimestamp, setShowTimestamp] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined" && SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setCurrentText(interimTranscript)
        if (finalTranscript) {
          const timestamp = new Date().toLocaleTimeString()
          setTranscript((prev) => [...prev, `[${timestamp}] ${finalTranscript}`])
          setCurrentText("")
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current?.start()
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isListening])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const clearTranscript = () => {
    setTranscript([])
    setCurrentText("")
  }

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
              <CaptionsIcon className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">Live Captions</span>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${isListening ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"}`}
          >
            {isListening ? "Listening..." : "Paused"}
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="grid gap-6">
          {/* Caption Display */}
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle>Real-time Speech to Text</CardTitle>
              <CardDescription>Speak and see your words appear instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="min-h-[300px] max-h-[500px] overflow-y-auto p-4 bg-muted/50 rounded-xl space-y-2"
                style={{ fontSize: `${fontSize}px` }}
              >
                {transcript.length === 0 && !currentText && (
                  <p className="text-muted-foreground text-center py-8">
                    Click "Start Listening" to begin capturing speech...
                  </p>
                )}
                {transcript.map((text, index) => (
                  <p key={index} className="text-foreground leading-relaxed">
                    {showTimestamp ? text : text.replace(/\[.*?\]\s/, "")}
                  </p>
                ))}
                {currentText && <p className="text-primary italic">{currentText}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    onClick={toggleListening}
                    className={`flex-1 ${isListening ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"}`}
                  >
                    {isListening ? "Stop Listening" : "Start Listening"}
                  </Button>
                  <Button variant="outline" onClick={clearTranscript}>
                    Clear
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recognitionRef.current
                    ? "Speech recognition is available"
                    : "Speech recognition is not supported in this browser"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Font Size: {fontSize}px</Label>
                  <Slider value={[fontSize]} onValueChange={([v]) => setFontSize(v)} min={14} max={32} step={2} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Timestamps</Label>
                  <Switch checked={showTimestamp} onCheckedChange={setShowTimestamp} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
