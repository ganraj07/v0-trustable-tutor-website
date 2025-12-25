"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/lib/user-context"

interface AudioEnvironment {
  id: string
  name: string
  description: string
  locations: Location[]
  objective: string
}

interface Location {
  id: string
  name: string
  sound: string
  audioUrl: string
  discovered: boolean
}

export default function SoundMapExplorerPage() {
  const router = useRouter()
  const { user } = useUser()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentEnvIndex, setCurrentEnvIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [discoveredLocations, setDiscoveredLocations] = useState<string[]>([])
  const [playingSound, setPlayingSound] = useState<string | null>(null)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  const environments: AudioEnvironment[] = [
    {
      id: "env-1",
      name: "The Library",
      description: "You're in a quiet library. Navigate using audio cues to find different sections.",
      objective: "Find the Reference Desk and Books Aisle",
      locations: [
        {
          id: "loc-1-1",
          name: "Reference Desk",
          sound: "ding",
          audioUrl: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YCIAAAAAAA==",
          discovered: false,
        },
        {
          id: "loc-1-2",
          name: "Books Aisle",
          sound: "rustle",
          audioUrl: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YCIAAAAAAA==",
          discovered: false,
        },
        {
          id: "loc-1-3",
          name: "Computer Lab",
          sound: "beep",
          audioUrl: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YCIAAAAAAA==",
          discovered: false,
        },
      ],
    },
    {
      id: "env-2",
      name: "The Forest Path",
      description: "You're on a forest trail. Listen for different sounds to navigate.",
      objective: "Find the Waterfall and Bird Nest",
      locations: [
        {
          id: "loc-2-1",
          name: "Waterfall",
          sound: "whoosh",
          audioUrl: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YCIAAAAAAA==",
          discovered: false,
        },
        {
          id: "loc-2-2",
          name: "Bird Nest",
          sound: "chirp",
          audioUrl: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YCIAAAAAAA==",
          discovered: false,
        },
        {
          id: "loc-2-3",
          name: "Hiking Trail",
          sound: "footsteps",
          audioUrl: "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YCIAAAAAAA==",
          discovered: false,
        },
      ],
    },
  ]

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const startGame = () => {
    setGameStarted(true)
    speak(`Welcome to Sound Map Explorer. ${environments[0].description} Your objective: ${environments[0].objective}`)
  }

  const playLocationSound = (location: Location) => {
    setPlayingSound(location.id)
    speak(`You found the ${location.name}. ${location.sound}`)

    if (!discoveredLocations.includes(location.id)) {
      setDiscoveredLocations([...discoveredLocations, location.id])
      setScore(score + 10)
    }

    setTimeout(() => setPlayingSound(null), 2000)
  }

  const nextEnvironment = () => {
    if (currentEnvIndex < environments.length - 1) {
      setCurrentEnvIndex(currentEnvIndex + 1)
      setDiscoveredLocations([])
      const newEnv = environments[currentEnvIndex + 1]
      speak(`You've moved to the next area. ${newEnv.description} Objective: ${newEnv.objective}`)
    } else {
      setGameStarted(false)
    }
  }

  if (!user || user.role !== "student") {
    return null
  }

  const currentEnv = environments[currentEnvIndex]
  const discoveryProgress = (discoveredLocations.length / currentEnv.locations.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/student" className="p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="font-bold text-lg">Sound Map Explorer</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-cyan-600">{score}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 lg:p-8">
        {!gameStarted ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Sound Map Explorer</CardTitle>
              <CardDescription className="text-center mt-4">
                An audio-based adventure game for students with visual impairments and everyone who loves audio
                exploration!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-3">
                <p className="text-lg font-semibold">How to Play:</p>
                <ul className="text-left max-w-md mx-auto space-y-2">
                  <li>Listen to audio cues describing locations</li>
                  <li>Click buttons to explore and discover new areas</li>
                  <li>Find all locations to complete each level</li>
                  <li>Use keyboard arrow keys for navigation (coming soon)</li>
                </ul>
              </div>
              <Button onClick={startGame} className="w-full py-6 text-lg bg-cyan-600 hover:bg-cyan-700">
                Start Game
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <div>
                <CardTitle className="text-2xl mb-2">{currentEnv.name}</CardTitle>
                <CardDescription>{currentEnv.description}</CardDescription>
                <p className="text-sm font-semibold mt-3 text-gray-700">Objective: {currentEnv.objective}</p>
              </div>
              <Progress value={discoveryProgress} className="mt-4" />
              <p className="text-sm text-gray-600 mt-2">
                {discoveredLocations.length} of {currentEnv.locations.length} locations discovered
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {currentEnv.locations.map((location) => (
                  <Button
                    key={location.id}
                    onClick={() => playLocationSound(location)}
                    className={`justify-start text-left h-auto py-4 px-6 text-lg font-semibold ${
                      discoveredLocations.includes(location.id)
                        ? "bg-green-100 hover:bg-green-200 text-green-900 border-green-400"
                        : "bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-400"
                    }`}
                    disabled={playingSound !== null}
                    variant="outline"
                  >
                    <span>
                      {discoveredLocations.includes(location.id) ? "✓ " : "? "}
                      {location.name} ({location.sound})
                    </span>
                  </Button>
                ))}
              </div>

              {discoveredLocations.length === currentEnv.locations.length && (
                <Button
                  onClick={nextEnvironment}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 py-4 text-lg font-semibold"
                >
                  {currentEnvIndex < environments.length - 1 ? "Next Environment" : "Complete Game"}
                </Button>
              )}

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                  <p className="text-sm text-yellow-900">
                    Tip: Click on locations multiple times to hear them clearly. The game is fully accessible without
                    visuals!
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}
      </main>

      <audio ref={audioRef} />
    </div>
  )
}
