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

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  length: number
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

type SpeechRecognitionResultList = SpeechRecognitionResult[]

interface SpeechRecognitionAPI {
  new (): SpeechRecognitionAPI
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
  start: () => void
  stop: () => void
  abort: () => void
}

export default function LiveCaptionsPage() {
  const router = useRouter()
  const { user } = useUser()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState<string[]>([])
  const [currentText, setCurrentText] = useState("")
  const [fontSize, setFontSize] = useState(18)
  const [showTimestamp, setShowTimestamp] = useState(true)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string>("")
  const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown")
  const recognitionRef = useRef<any>(null)
  const [demoMode, setDemoMode] = useState(false)
  const demoRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkPermissions = async () => {
      try {
        const result = await navigator.permissions.query({ name: "microphone" as PermissionName })
        setPermissionStatus(result.state as "granted" | "denied" | "prompt")
      } catch (err) {
        setPermissionStatus("unknown")
      }
    }

    checkPermissions()

    try {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognitionAPI) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognitionAPI()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onstart = () => {
          setError("")
          setDemoMode(false)
        }

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " "
            } else {
              interimTranscript += transcript
            }
          }

          setCurrentText(interimTranscript || finalTranscript)

          if (finalTranscript.trim()) {
            const timestamp = new Date().toLocaleTimeString()
            setTranscript((prev) => [...prev, `[${timestamp}] ${finalTranscript.trim()}`])
            setCurrentText("")
          }
        }

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          if (event.error === "not-allowed" || event.error === "permission-denied") {
            setError(
              "Microphone access denied. Your browser may require permission. Please allow microphone access in browser settings, or use Demo Mode to see how captions work.",
            )
            setPermissionStatus("denied")
          } else if (event.error !== "no-speech") {
            setError(`Error: ${event.error}. Please check your microphone.`)
          }
        }

        recognitionRef.current.onend = () => {
          if (isListening && !demoMode) {
            try {
              recognitionRef.current?.start()
            } catch (e) {}
          }
        }
      } else {
        setIsSupported(false)
        setError("Speech Recognition is not supported in your browser. Please use Chrome, Edge, or Safari.")
      }
    } catch (err) {
      setError("Failed to initialize speech recognition")
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {}
      }
      if (demoRef.current) {
        clearInterval(demoRef.current)
      }
    }
  }, [isListening])

  const demoSamples = [
    "Hello, today we're learning about photosynthesis",
    "Plants convert sunlight into chemical energy",
    "This process is essential for life on Earth",
    "Let me explain the different stages",
    "First, light is absorbed by chlorophyll",
  ]

  const startDemoMode = () => {
    setDemoMode(true)
    setIsListening(true)
    setTranscript([])
    setCurrentText("")
    setError("")

    let index = 0
    if (demoRef.current) clearInterval(demoRef.current)

    demoRef.current = setInterval(() => {
      if (index < demoSamples.length) {
        const timestamp = new Date().toLocaleTimeString()
        setTranscript((prev) => [...prev, `[${timestamp}] ${demoSamples[index]}`])
        index++
      } else {
        if (demoRef.current) clearInterval(demoRef.current)
        setIsListening(false)
      }
    }, 2000)
  }

  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) {
      setError("Speech recognition is not available. Please use Demo Mode to test the feature.")
      return
    }

    if (permissionStatus === "denied") {
      setError(
        "Microphone access is denied by your browser. Please use Demo Mode to see how captions work, or update your browser permissions.",
      )
      return
    }

    if (isListening) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
        if (demoRef.current) clearInterval(demoRef.current)
        setDemoMode(false)
      } catch (err) {
        setError("Cannot stop microphone")
      }
    } else {
      try {
        setTranscript([])
        setCurrentText("")
        setError("")
        recognitionRef.current.start()
        setIsListening(true)
      } catch (err) {
        setError("Cannot start microphone. Permission may be denied. Use Demo Mode to see how captions work.")
        setIsListening(false)
      }
    }
  }

  const clearTranscript = () => {
    setTranscript([])
    setCurrentText("")
    if (demoRef.current) clearInterval(demoRef.current)
  }

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
              <CaptionsIcon className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">Live Captions</span>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isListening ? "bg-green-500/20 text-green-500" : "bg-muted text-muted-foreground"
            }`}
          >
            {isListening ? (demoMode ? "Demo Mode..." : "Listening...") : "Paused"}
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="grid gap-6">
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-700 text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

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
                    {isSupported
                      ? demoMode
                        ? "Demo mode showing sample captions..."
                        : 'Click "Start Listening" to begin capturing speech...'
                      : "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari."}
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

          <div className="grid sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={toggleListening}
                    disabled={!isSupported}
                    className={`${isListening ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"}`}
                  >
                    {isListening ? "Stop Listening" : "Start Listening"}
                  </Button>
                  <Button variant="outline" onClick={startDemoMode} disabled={isListening}>
                    Demo Mode
                  </Button>
                  <Button variant="ghost" onClick={clearTranscript}>
                    Clear Transcript
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isSupported
                    ? permissionStatus === "denied"
                      ? "Microphone access denied. Try Demo Mode or check browser permissions."
                      : "Speech recognition is available"
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
