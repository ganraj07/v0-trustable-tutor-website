"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

const BRAILLE_MAP: { [key: string]: string } = {
  "1": "a",
  "1,2": "b",
  "1,4": "c",
  "1,4,5": "d",
  "1,5": "e",
  "1,2,4": "f",
  "1,2,4,5": "g",
  "1,2,5": "h",
  "2,4": "i",
  "2,4,5": "j",
  "1,3": "k",
  "1,2,3": "l",
  "1,3,4": "m",
  "1,3,4,5": "n",
  "1,3,5": "o",
  "1,2,3,4": "p",
  "1,2,3,4,5": "q",
  "1,2,3,5": "r",
  "2,3,4": "s",
  "2,3,4,5": "t",
  "1,3,6": "u",
  "1,2,3,6": "v",
  "2,4,5,6": "w",
  "1,3,4,6": "x",
  "1,3,4,5,6": "y",
  "1,3,5,6": "z",
  "2,3,4,5,6": "0",
  "1": "1",
  "1,2": "2",
  "1,4": "3",
  "1,4,5": "4",
  "1,5": "5",
  "1,2,4": "6",
  "1,2,4,5": "7",
  "1,2,5": "8",
  "2,4": "9",
  "3,6": " ",
}

const NUMPAD_MAP: { [key: string]: number } = {
  Numpad7: 1,
  Numpad4: 2,
  Numpad1: 3,
  Numpad8: 4,
  Numpad5: 5,
  Numpad2: 6,
}

export function BraileTypingInterface() {
  const [output, setOutput] = useState("")
  const [status, setStatus] = useState("Ready to type...")
  const [pressedDots, setPressedDots] = useState<Set<number>>(new Set())
  const [volume, setVolume] = useState(0.8)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const keysDownRef = useRef<Set<string>>(new Set())

  const speakText = (text: string) => {
    if (typeof window === "undefined") return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = volume
    speechSynthesis.cancel()
    speechSynthesis.speak(utterance)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const code = e.code
    if (!(code in NUMPAD_MAP)) return

    e.preventDefault()
    keysDownRef.current.add(code)
    const dot = NUMPAD_MAP[code]
    const newSet = new Set(pressedDots)
    newSet.add(dot)
    setPressedDots(newSet)

    // Clear existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    const code = e.code
    if (!(code in NUMPAD_MAP)) return

    keysDownRef.current.delete(code)

    // If all keys are released, process the chord
    if (keysDownRef.current.size === 0) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        if (pressedDots.size > 0) {
          processChord()
        }
        setPressedDots(new Set())
      }, 150)
    }
  }

  const processChord = () => {
    const dotsArray = Array.from(pressedDots).sort()
    const dotsKey = dotsArray.join(",")

    // Handle backspace (dots 2,5,6)
    if (dotsKey === "2,5,6") {
      setOutput((prev) => {
        const newOutput = prev.slice(0, -1)
        speakText("Backspace")
        setStatus(`Backspace pressed. ${newOutput.length} characters`)
        return newOutput
      })
      return
    }

    // Handle space (dots 3,6)
    if (dotsKey === "3,6") {
      setOutput((prev) => prev + " ")
      speakText("Space")
      setStatus("Space added")
      return
    }

    const character = BRAILLE_MAP[dotsKey]

    if (character) {
      setOutput((prev) => prev + character)
      speakText(character.toUpperCase())
      setStatus(`Typed ${character.toUpperCase()}`)
    } else {
      setStatus(`Invalid combination: ${dotsKey}`)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [pressedDots])

  const clearOutput = () => {
    setOutput("")
    setStatus("Text cleared")
    speakText("Text cleared")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setStatus("Copied to clipboard!")
    speakText("Copied to clipboard")
  }

  const downloadText = () => {
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(output))
    element.setAttribute("download", "braille-text.txt")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    setStatus("File downloaded")
    speakText("File downloaded")
  }

  const getDotDisplay = (dotNum: number) => {
    return pressedDots.has(dotNum) ? "bg-primary" : "bg-secondary/20"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Braille Typing Interface
          </h1>
          <p className="text-gray-600">Type using numpad braille dot patterns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Output Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
                <CardTitle>Text Output</CardTitle>
                <CardDescription className="text-blue-100">Your typed text appears here</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-gray-50 rounded-lg p-6 min-h-32 max-h-64 overflow-y-auto font-mono text-lg leading-relaxed border-2 border-gray-200">
                  {output || <span className="text-gray-400">Start typing...</span>}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Characters: {output.length} | Words: {output.trim().split(/\s+/).filter((w) => w).length}
                </div>
              </CardContent>
            </Card>

            {/* Control Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={clearOutput} variant="destructive" className="flex-1">
                Clear All
              </Button>
              <Button onClick={copyToClipboard} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Copy
              </Button>
              <Button onClick={downloadText} className="flex-1 bg-green-600 hover:bg-green-700">
                Download
              </Button>
            </div>
          </div>

          {/* Right Panel - Instructions & Status */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-center text-lg font-semibold text-gray-800">{status}</p>
              </CardContent>
            </Card>

            {/* Braille Cell Display */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="text-lg">Active Dots</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-white border-2 border-gray-300 rounded-lg p-4 aspect-square flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 4, 2, 5, 3, 6].map((dot) => (
                      <div
                        key={dot}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold transition-all ${getDotDisplay(dot)}`}
                      >
                        {dot}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Volume Control */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="text-lg">Volume</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <Slider value={[volume]} onValueChange={(val) => setVolume(val[0])} min={0} max={1} step={0.1} />
                <p className="text-sm text-gray-600 text-center">{Math.round(volume * 100)}%</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle>Numpad Key Mapping</CardTitle>
            <CardDescription className="text-indigo-100">Use your keyboard numpad to type</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Dot Mapping:</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">Numpad 7</span> → Dot 1
                  </div>
                  <div>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">Numpad 4</span> → Dot 2
                  </div>
                  <div>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">Numpad 1</span> → Dot 3
                  </div>
                  <div>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">Numpad 8</span> → Dot 4
                  </div>
                  <div>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">Numpad 5</span> → Dot 5
                  </div>
                  <div>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">Numpad 2</span> → Dot 6
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Special Commands:</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">3 + 6</span> = SPACE
                  </div>
                  <div>
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded">2 + 5 + 6</span> = BACKSPACE
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-700">
                      Press multiple numpad keys simultaneously to create braille characters. Release all keys after 150ms to register the input.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Examples */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
            <CardTitle>Examples</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                { keys: "1", char: "A" },
                { keys: "1,2", char: "B" },
                { keys: "1,4", char: "C" },
                { keys: "1,5", char: "E" },
                { keys: "1,2,4", char: "F" },
                { keys: "2,4", char: "I" },
                { keys: "1,3", char: "K" },
                { keys: "2,4,5", char: "J" },
              ].map((ex) => (
                <div key={ex.keys} className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="font-mono text-xs text-gray-600">{ex.keys}</p>
                  <p className="text-lg font-bold text-gray-800">{ex.char}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
