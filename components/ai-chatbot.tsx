"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useUser } from "@/lib/user-context"
import { BrainIcon, SparklesIcon, VolumeIcon } from "@/components/icons"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
  timestamp: Date
}

export function AIChatbot() {
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onstart = () => setIsListening(true)
        recognitionRef.current.onend = () => setIsListening(false)
        recognitionRef.current.onresult = (event: any) => {
          let transcript = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript
          }
          setInputValue(transcript)
        }
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Subject-specific responses
    const subjectKeywords: Record<string, string[]> = {
      math: ["math", "calculate", "equation", "problem", "number", "geometry", "algebra"],
      science: ["science", "biology", "chemistry", "physics", "experiment", "atom", "cell"],
      english: ["english", "literature", "reading", "writing", "grammar", "essay", "vocabulary"],
      history: ["history", "war", "ancient", "revolution", "historical", "timeline"],
    }

    let selectedSubject = "general"
    for (const [subject, keywords] of Object.entries(subjectKeywords)) {
      if (keywords.some((kw) => lowerMessage.includes(kw))) {
        selectedSubject = subject
        break
      }
    }

    // Contextual responses
    const responses: Record<string, Record<string, string>> = {
      general: {
        greeting: `Hi ${user?.name?.split(" ")[0] || "there"}! I'm your AI learning companion. How can I help you learn today?`,
        help: "I can help you with explanations, homework, quizzes, practice problems, and learning strategies. What would you like to focus on?",
        motivation:
          "Great question! Remember, every expert was once a beginner. Keep practicing and you'll master this!",
        feedback: "That's a thoughtful question! Let me explain this in a simpler way...",
      },
      math: {
        greeting: `Ready to conquer math? I'm here to help you understand concepts, solve problems, and build confidence!`,
        help: "I can help you with fractions, equations, geometry, algebra, and word problems. What math topic is challenging you?",
        motivation: "Math is like a puzzle - keep trying different approaches and you'll find the solution!",
        feedback:
          "Great effort! Here's a step-by-step breakdown to help you understand this better. Start with the basics and build up.",
      },
      science: {
        greeting: `Let's explore the wonderful world of science together! What topic interests you?`,
        help: "I can explain biology, chemistry, physics, and conduct virtual experiments. What would you like to learn?",
        motivation: "Science is about curiosity and discovery. You're asking the right questions!",
        feedback: "Excellent observation! Let me help you connect the concepts to understand the bigger picture.",
      },
      english: {
        greeting: `Welcome to English learning! Let's improve your reading, writing, and communication skills.`,
        help: "I can help with grammar, vocabulary, essay writing, literature analysis, and reading comprehension. What interests you?",
        motivation: "Every great writer started with one sentence. Keep writing and expressing yourself!",
        feedback: "Good thinking! Let me show you how to make your writing even more impactful.",
      },
    }

    // Determine response type
    let responseType = "feedback"
    if (lowerMessage.match(/^(hi|hello|hey|greetings|what can you do|introduce|who are you)/)) {
      responseType = "greeting"
    } else if (lowerMessage.match(/help|assist|can you|what do you/)) {
      responseType = "help"
    } else if (lowerMessage.match(/motivat|encourage|hard|difficult|stuck|give up|too hard/)) {
      responseType = "motivation"
    }

    return responses[selectedSubject][responseType] || responses.general[responseType]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: generateAIResponse(inputValue),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)

      // Auto-play voice response
      speakMessage(aiResponse.text)
    }, 500)
  }

  const speakMessage = (text: string) => {
    if (!("speechSynthesis" in window)) {
      console.log("Speech synthesis not supported")
      return
    }

    window.speechSynthesis.cancel() // Cancel any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    speechSynthesisRef.current = utterance
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const toggleSpeech = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      speakMessage(text)
    }
  }

  const suggestedQuestions = [
    "🔢 Help me understand fractions",
    "🔬 Explain photosynthesis simply",
    "📖 Help me with essay writing",
    "💡 I need motivation to study",
  ]

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
        }`}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <BrainIcon className="w-7 h-7 text-white" />
            <SparklesIcon className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] shadow-2xl flex flex-col border-2">
          <CardHeader className="pb-2 bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="relative">
                <BrainIcon className="w-6 h-6" />
                <SparklesIcon className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1" />
              </div>
              <span>Tutor+ Assistant</span>
              {isLoading && <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full">Thinking...</span>}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <BrainIcon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Hi {user?.name?.split(" ")[0] || "there"}!</p>
                  <p className="text-sm text-muted-foreground mt-1">I'm your AI learning buddy. Ask me anything!</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInputValue(q)
                      }}
                      className="w-full text-left p-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl flex items-end gap-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                    {message.role === "assistant" && (
                      <button
                        onClick={() => toggleSpeech(message.text)}
                        className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
                        title="Toggle voice"
                      >
                        <VolumeIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={isListening ? stopListening : startListening}
                className={isListening ? "bg-red-500 text-white" : ""}
                title="Voice input"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.7 2.36-2.2 0-4.2-.9-5.7-2.36M9 18.9v2.04c0 .42.35.77.77.77h4.46c.42 0 .77-.35.77-.77v-2.04" />
                </svg>
              </Button>
              <Button type="submit" disabled={isLoading || !inputValue.trim()}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  )
}
