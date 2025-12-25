"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CompanionMessage {
  type: "motivation" | "tip" | "celebration"
  text: string
  emoji: string
}

export function LearningCompanion() {
  const [isVisible, setIsVisible] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [showMessage, setShowMessage] = useState(false)

  const messages: CompanionMessage[] = [
    {
      type: "motivation",
      text: "You're doing amazing! Keep up the great work!",
      emoji: "🌟",
    },
    {
      type: "tip",
      text: "Pro tip: Take notes during class to improve retention by 40%!",
      emoji: "💡",
    },
    {
      type: "celebration",
      text: "Congratulations! You've earned a new badge!",
      emoji: "🎉",
    },
    {
      type: "motivation",
      text: "Every mistake is a step towards mastery. You've got this!",
      emoji: "💪",
    },
    {
      type: "tip",
      text: "Use the air drawing feature to visualize your ideas!",
      emoji: "✨",
    },
  ]

  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      setShowMessage(true)
    }, 500)

    const messageTimer = setTimeout(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
      setShowMessage(false)
    }, 4000)

    return () => {
      clearTimeout(timer)
      clearTimeout(messageTimer)
    }
  }, [messageIndex, isVisible, messages.length])

  const currentMessage = messages[messageIndex]

  return (
    <>
      {/* Floating Companion Avatar */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center text-3xl animate-bounce"
          aria-label="Open learning companion"
        >
          🤖
        </button>
      )}

      {/* Companion Panel */}
      {isVisible && (
        <Card className="fixed bottom-6 right-6 z-40 w-80 max-h-[500px] shadow-2xl animate-in slide-in-from-bottom-4">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg">Tutor Bot</h3>
                <p className="text-xs text-muted-foreground">Your learning companion</p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
                aria-label="Close companion"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Avatar with animation */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-5xl animate-bounce">
                🤖
              </div>
            </div>

            {/* Message */}
            <div className="min-h-[60px] mb-4">
              {showMessage && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 animate-in fade-in duration-300">
                  <div className="flex gap-2 mb-2">
                    <span className="text-2xl">{currentMessage.emoji}</span>
                    <span className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-medium">
                      {currentMessage.type}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{currentMessage.text}</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full text-xs h-8 bg-transparent">
                <MessageCircle className="w-3 h-3 mr-1" />
                Ask a Question
              </Button>
              <Button variant="outline" className="w-full text-xs h-8 bg-transparent">
                View Tips & Tricks
              </Button>
              <Button className="w-full text-xs h-8">View My Progress</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
