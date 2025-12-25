"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface EmotionData {
  confusion: number
  focus: number
  engagement: number
  disengagement: number
  timestamp: Date
}

export function EmotionDetection() {
  const [emotionData, setEmotionData] = useState<EmotionData>({
    confusion: 15,
    focus: 85,
    engagement: 90,
    disengagement: 5,
    timestamp: new Date(),
  })

  const [emotionHistory, setEmotionHistory] = useState<EmotionData[]>([])

  useEffect(() => {
    // Simulate real-time emotion detection updates
    const interval = setInterval(() => {
      const newData: EmotionData = {
        confusion: Math.max(0, Math.min(100, emotionData.confusion + (Math.random() - 0.5) * 20)),
        focus: Math.max(0, Math.min(100, emotionData.focus + (Math.random() - 0.5) * 15)),
        engagement: Math.max(0, Math.min(100, emotionData.engagement + (Math.random() - 0.5) * 10)),
        disengagement: Math.max(0, Math.min(100, emotionData.disengagement + (Math.random() - 0.5) * 10)),
        timestamp: new Date(),
      }
      setEmotionData(newData)
      setEmotionHistory((prev) => [...prev.slice(-9), newData])
    }, 5000)

    return () => clearInterval(interval)
  }, [emotionData])

  const getEmotionColor = (metric: string): string => {
    if (metric === "focus" || metric === "engagement") {
      return "bg-green-500"
    }
    return "bg-orange-500"
  }

  const getEmotionIcon = (metric: string): string => {
    switch (metric) {
      case "confusion":
        return "😕"
      case "focus":
        return "🎯"
      case "engagement":
        return "🚀"
      case "disengagement":
        return "😴"
      default:
        return "😊"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Real-time Engagement Detection</span>
        </CardTitle>
        <CardDescription>Privacy-safe emotion and engagement metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Metrics */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "focus", label: "Focus Level", value: emotionData.focus },
            { key: "engagement", label: "Engagement", value: emotionData.engagement },
            { key: "confusion", label: "Confusion", value: emotionData.confusion },
            { key: "disengagement", label: "Disengagement", value: emotionData.disengagement },
          ].map(({ key, label, value }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                  <span>{getEmotionIcon(key)}</span>
                  {label}
                </label>
                <span className="text-sm font-bold text-primary">{Math.round(value)}%</span>
              </div>
              <Progress value={value} className="h-2" />
            </div>
          ))}
        </div>

        {/* AI Insights */}
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-semibold text-foreground text-sm mb-1">AI Insight</p>
              <p className="text-xs text-muted-foreground">
                {emotionData.focus > 80
                  ? "Excellent focus! You're in the zone. Keep going!"
                  : emotionData.confusion > 30
                    ? "Seems you might need clarification. Would you like to review this topic?"
                    : "Great engagement! You're learning effectively."}
              </p>
            </div>
          </div>
        </div>

        {/* Adaptive Recommendations */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Recommended Actions</p>
          {emotionData.confusion > 25 && (
            <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg text-xs">
              <span>⚠️</span>
              <span className="text-orange-900">Take a short break or ask for clarification</span>
            </div>
          )}
          {emotionData.engagement > 85 && (
            <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg text-xs">
              <span>✅</span>
              <span className="text-green-900">Perfect! Consider advancing to the next topic</span>
            </div>
          )}
          {emotionData.disengagement > 20 && (
            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg text-xs">
              <span>ℹ️</span>
              <span className="text-blue-900">Try interactive activities to boost engagement</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
