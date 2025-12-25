"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/lib/user-context"

interface Scenario {
  id: string
  title: string
  description: string
  emotion: string
  choices: Choice[]
  feedback: string
}

interface Choice {
  id: string
  text: string
  isCorrect: boolean
  feedback: string
}

export default function EmotionQuestPage() {
  const router = useRouter()
  const { user } = useUser()
  const [gameStarted, setGameStarted] = useState(false)
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  const scenarios: Scenario[] = [
    {
      id: "1",
      title: "The Forgotten Homework",
      description: "You just realized you forgot your homework at home and the teacher is collecting it in 5 minutes!",
      emotion: "Anxiety/Worry",
      choices: [
        {
          id: "a",
          text: "Tell the teacher immediately and explain what happened",
          isCorrect: true,
          feedback:
            "Great choice! Being honest and communicating early shows responsibility. The teacher will appreciate your honesty.",
        },
        {
          id: "b",
          text: "Hide and hope the teacher doesn't notice you",
          isCorrect: false,
          feedback:
            "This might make things worse. It's better to face the situation honestly. Next time, try communicating with the teacher.",
        },
        {
          id: "c",
          text: "Ask a friend for their homework to copy quickly",
          isCorrect: false,
          feedback: "That would be cheating. Instead, try talking to your teacher about bringing it tomorrow.",
        },
      ],
    },
    {
      id: "2",
      title: "New Student Nervousness",
      description: "It's your first day at a new school and you feel nervous about meeting new people.",
      emotion: "Nervousness/Fear",
      choices: [
        {
          id: "a",
          text: "Introduce yourself to someone and start a friendly conversation",
          isCorrect: true,
          feedback:
            "Excellent! Taking the first step to connect with others builds confidence and helps you make new friends.",
        },
        {
          id: "b",
          text: "Stay alone and avoid talking to anyone",
          isCorrect: false,
          feedback:
            "While it feels safe, you might miss out on friendships. Being brave and reaching out is rewarding!",
        },
        {
          id: "c",
          text: "Follow someone around without talking",
          isCorrect: false,
          feedback: "That might make others uncomfortable. Instead, try starting a conversation about class or lunch.",
        },
      ],
    },
    {
      id: "3",
      title: "The Frustrating Mistake",
      description: "You made a silly mistake during the math test and now you're feeling frustrated with yourself.",
      emotion: "Frustration/Disappointment",
      choices: [
        {
          id: "a",
          text: "Learn from the mistake and study that topic more carefully",
          isCorrect: true,
          feedback:
            "Perfect! Mistakes are learning opportunities. This shows growth mindset and determination to improve.",
        },
        {
          id: "b",
          text: "Give up on math because you're not good at it",
          isCorrect: false,
          feedback: "Everyone makes mistakes! Keep trying. Practice and effort will help you improve.",
        },
        {
          id: "c",
          text: "Blame the teacher for the hard test",
          isCorrect: false,
          feedback: "Blaming others doesn't help. Focus on what you can control - your effort and practice.",
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
    speak(
      `Welcome to Emotion Quest! You'll face real-life situations and learn how to manage emotions. Let's start with the first scenario.`,
    )
  }

  const handleChoiceClick = (choice: Choice) => {
    setSelectedChoice(choice.id)
    setShowFeedback(true)

    if (choice.isCorrect) {
      setScore(score + 10)
      speak(`Correct! ${choice.feedback}`)
    } else {
      speak(`Not quite. ${choice.feedback}`)
    }
  }

  const nextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1)
      setSelectedChoice(null)
      setShowFeedback(false)
      const nextScenario = scenarios[currentScenarioIndex + 1]
      speak(nextScenario.description)
    } else {
      speak(`Congratulations! You completed Emotion Quest with a score of ${score} points!`)
      setGameStarted(false)
    }
  }

  if (!user || user.role !== "student") {
    return null
  }

  const currentScenario = scenarios[currentScenarioIndex]
  const progress = ((currentScenarioIndex + 1) / scenarios.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/student" className="p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="font-bold text-lg">Emotion Quest</span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-purple-600">{score}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 lg:p-8">
        {!gameStarted ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Emotion Quest</CardTitle>
              <CardDescription className="text-center mt-4">
                Learn to recognize, understand, and respond to emotions through interactive scenarios!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="space-y-3">
                <p className="text-lg font-semibold">How to Play:</p>
                <ul className="text-left max-w-md mx-auto space-y-2">
                  <li>Read emotional scenarios from everyday life</li>
                  <li>Choose your response to each situation</li>
                  <li>Learn from feedback about emotional intelligence</li>
                  <li>Earn points for making wise emotional choices</li>
                </ul>
              </div>
              <Button onClick={startGame} className="w-full py-6 text-lg bg-purple-600 hover:bg-purple-700">
                Start Emotion Quest
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">
                    Scenario {currentScenarioIndex + 1} of {scenarios.length}
                  </span>
                  <span className="text-sm font-bold text-purple-600">{currentScenario.emotion}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <CardTitle className="text-2xl mb-2">{currentScenario.title}</CardTitle>
              <CardDescription className="text-base">{currentScenario.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm font-semibold text-purple-900">What would you do?</p>
              </div>

              <div className="grid gap-3">
                {currentScenario.choices.map((choice) => (
                  <Button
                    key={choice.id}
                    onClick={() => !showFeedback && handleChoiceClick(choice)}
                    variant="outline"
                    className={`justify-start text-left h-auto py-4 px-6 font-medium ${
                      selectedChoice === choice.id
                        ? choice.isCorrect
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    disabled={showFeedback}
                  >
                    <span>
                      {selectedChoice === choice.id && (choice.isCorrect ? "✓ " : "✗ ")}
                      {choice.text}
                    </span>
                  </Button>
                ))}
              </div>

              {showFeedback && (
                <div
                  className={`p-4 rounded-lg ${selectedChoice && currentScenario.choices.find((c) => c.id === selectedChoice)?.isCorrect ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}
                >
                  <p className="text-sm font-semibold mb-2">
                    {selectedChoice && currentScenario.choices.find((c) => c.id === selectedChoice)?.isCorrect
                      ? "Great choice!"
                      : "Good try!"}
                  </p>
                  <p className="text-sm">
                    {selectedChoice && currentScenario.choices.find((c) => c.id === selectedChoice)?.feedback}
                  </p>
                </div>
              )}

              {showFeedback && (
                <Button
                  onClick={nextScenario}
                  className="w-full bg-purple-600 hover:bg-purple-700 py-4 text-lg font-semibold"
                >
                  {currentScenarioIndex < scenarios.length - 1 ? "Next Scenario" : "Complete Game"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
