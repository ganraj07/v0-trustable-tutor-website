"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/lib/user-context"
import { AudioIcon } from "@/components/icons"

export default function AudioModePage() {
  const router = useRouter()
  const { user } = useUser()
  const [text, setText] = useState(
    "Welcome to Trustable Tutor Plus! This is a personalized audio learning experience designed just for you. You can adjust the speed and voice to match your learning preferences.",
  )
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [selectedVoice, setSelectedVoice] = useState("")
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices()
      setVoices(availableVoices)
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0].name)
      }
    }

    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      speechSynthesis.cancel()
    }
  }, [selectedVoice])

  const speak = () => {
    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = pitch

    const voice = voices.find((v) => v.name === selectedVoice)
    if (voice) utterance.voice = voice

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  const sampleLessons = [
    {
      title: "Introduction to Fractions",
      text: "A fraction represents a part of a whole. The top number is called the numerator, and the bottom number is called the denominator. For example, in the fraction one-half, one is the numerator and two is the denominator.",
    },
    {
      title: "The Water Cycle",
      text: "The water cycle describes how water moves on, above, and below the surface of the Earth. Water evaporates from oceans and lakes, forms clouds through condensation, and falls back to Earth as precipitation.",
    },
    {
      title: "Basic Grammar",
      text: "A sentence must have a subject and a verb. The subject tells us who or what the sentence is about. The verb tells us what the subject does or is.",
    },
  ]

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
              <AudioIcon className="w-6 h-6 text-secondary" />
              <span className="font-bold text-lg">Audio Learning Mode</span>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${isSpeaking ? "bg-secondary/20 text-secondary animate-pulse" : "bg-muted text-muted-foreground"}`}
          >
            {isSpeaking ? "Playing..." : "Ready"}
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="grid gap-6">
          {/* Text Input */}
          <Card>
            <CardHeader>
              <CardTitle>Text to Speech</CardTitle>
              <CardDescription>Enter or paste any text to have it read aloud</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to read aloud..."
                className="min-h-[200px]"
              />
              <div className="flex gap-3">
                <Button
                  onClick={speak}
                  className={`flex-1 ${isSpeaking ? "bg-red-500 hover:bg-red-600" : "bg-secondary hover:bg-secondary/90"}`}
                >
                  <AudioIcon className="w-4 h-4 mr-2" />
                  {isSpeaking ? "Stop" : "Play"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Voice Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Voice Settings</CardTitle>
              <CardDescription>Customize your audio experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Voice</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Speed: {rate.toFixed(1)}x</Label>
                <Slider value={[rate]} onValueChange={([v]) => setRate(v)} min={0.5} max={2} step={0.1} />
              </div>

              <div className="space-y-2">
                <Label>Pitch: {pitch.toFixed(1)}</Label>
                <Slider value={[pitch]} onValueChange={([v]) => setPitch(v)} min={0.5} max={2} step={0.1} />
              </div>
            </CardContent>
          </Card>

          {/* Sample Lessons */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Lessons</CardTitle>
              <CardDescription>Try these pre-loaded lessons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {sampleLessons.map((lesson, index) => (
                  <button
                    key={index}
                    onClick={() => setText(lesson.text)}
                    className="p-4 text-left rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    <p className="font-semibold text-foreground">{lesson.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{lesson.text}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
