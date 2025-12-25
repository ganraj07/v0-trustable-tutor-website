"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/lib/user-context"

export default function AnalyticsPage() {
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.push("/login?role=teacher")
    }
  }, [user, router])

  if (!user || user.role !== "teacher") {
    return null
  }

  const analytics = [
    { class: "Math Grade 5", engagement: 92, attendance: 96, improvement: 15 },
    { class: "Science Grade 6", engagement: 85, attendance: 94, improvement: 12 },
    { class: "Math Grade 4", engagement: 88, attendance: 98, improvement: 18 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/teacher" className="p-2 rounded-lg hover:bg-muted transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="font-bold text-lg">Analytics</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 lg:p-8">
        <div className="grid gap-6">
          {analytics.map((item, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{item.class}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Engagement</span>
                    <span className="text-sm font-bold">{item.engagement}%</span>
                  </div>
                  <Progress value={item.engagement} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Attendance</span>
                    <span className="text-sm font-bold">{item.attendance}%</span>
                  </div>
                  <Progress value={item.attendance} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Learning Improvement</span>
                    <span className="text-sm font-bold">+{item.improvement}%</span>
                  </div>
                  <Progress value={item.improvement} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
