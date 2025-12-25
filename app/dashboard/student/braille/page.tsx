"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/lib/user-context"
import { BrailleIcon } from "@/components/icons"

// Basic Braille mapping (Grade 1 Braille)
const BRAILLE_MAP: Record<string, string> = {
  a: "⠁",
  b: "⠃",
  c: "⠉",
  d: "⠙",
  e: "⠑",
  f: "⠋",
  g: "⠛",
  h: "⠓",
  i: "⠊",
  j: "⠚",
  k: "⠅",
  l: "⠇",
  m: "⠍",
  n: "⠝",
  o: "⠕",
  p: "⠏",
  q: "⠟",
  r: "⠗",
  s: "⠎",
  t: "⠞",
  u: "⠥",
  v: "⠧",
  w: "⠺",
  x: "⠭",
  y: "⠽",
  z: "⠵",
  "1": "⠁",
  "2": "⠃",
  "3": "⠉",
  "4": "⠙",
  "5": "⠑",
  "6": "⠋",
  "7": "⠛",
  "8": "⠓",
  "9": "⠊",
  "0": "⠚",
  " ": " ",
  ".": "⠲",
  ",": "⠂",
  "?": "⠦",
  "!": "⠖",
  "'": "⠄",
  "-": "⠤",
}

export default function BraillePage() {
  const router = useRouter()
  const { user } = useUser()
  const [inputText, setInputText] = useState("Hello World")
  const [brailleOutput, setBrailleOutput] = useState("")
  const [dotSize, setDotSize] = useState(24)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  useEffect(() => {
    const converted = inputText
      .toLowerCase()
      .split("")
      .map((char) => BRAILLE_MAP[char] || char)
      .join("")
    setBrailleOutput(converted)
  }, [inputText])

  const sampleTexts = [
    { label: "Alphabet", text: "abcdefghijklmnopqrstuvwxyz" },
    { label: "Numbers", text: "1234567890" },
    { label: "Greeting", text: "Hello, how are you today?" },
    { label: "Learning", text: "I love to learn new things!" },
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
              <BrailleIcon className="w-6 h-6 text-chart-5" />
              <span className="font-bold text-lg">Braille Learning Support</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-4xl mx-auto">
        <div className="grid gap-6">
          {/* Text to Braille Converter */}
          <Card>
            <CardHeader>
              <CardTitle>Text to Braille Converter</CardTitle>
              <CardDescription>Type text to see its Braille representation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Input Text</Label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type something..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Braille Output</Label>
                <div
                  className="p-6 bg-muted rounded-xl min-h-[100px] font-mono"
                  style={{ fontSize: `${dotSize}px`, lineHeight: 1.5 }}
                >
                  {brailleOutput || "Braille will appear here..."}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dot Size: {dotSize}px</Label>
                <input
                  type="range"
                  min="16"
                  max="48"
                  value={dotSize}
                  onChange={(e) => setDotSize(Number.parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sample Texts */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Samples</CardTitle>
              <CardDescription>Try these example texts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-3">
                {sampleTexts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(sample.text)}
                    className="p-4 text-left rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    <p className="font-semibold text-foreground">{sample.label}</p>
                    <p className="text-sm text-muted-foreground">{sample.text}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Braille Alphabet Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Braille Alphabet Reference</CardTitle>
              <CardDescription>Learn the braille patterns for each letter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-3">
                {Object.entries(BRAILLE_MAP)
                  .filter(([char]) => /[a-z]/.test(char))
                  .map(([char, braille]) => (
                    <div
                      key={char}
                      className="flex flex-col items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <span className="text-2xl mb-1">{braille}</span>
                      <span className="text-sm font-semibold uppercase">{char}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Tactile Device Info */}
          <Card className="border-chart-5/20 bg-chart-5/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrailleIcon className="w-5 h-5 text-chart-5" />
                Braille Display Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This page is optimized for screen readers and can work with refreshable Braille displays. The Braille
                output uses Unicode Braille patterns that are compatible with most assistive technologies.
              </p>
              <div className="flex gap-3">
                <Button variant="outline">Connect Braille Display</Button>
                <Button variant="outline">Test Screen Reader</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
