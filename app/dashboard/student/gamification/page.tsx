"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { BrainIcon } from "@/components/icons"
import { GamificationPanel } from "@/components/gamification-panel"

export default function GamificationPage() {
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  if (!user || user.role !== "student") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard/student" className="flex items-center gap-2">
            <BrainIcon className="w-8 h-8 text-primary" />
            <span className="font-bold text-lg hidden sm:inline">
              Trustable Tutor<span className="text-primary">+</span>
            </span>
          </Link>
          <Button variant="outline" size="sm">
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Learning Journey</h1>
          <p className="text-muted-foreground">Track your progress, earn badges, and level up!</p>
        </div>

        {/* Gamification Panel */}
        <GamificationPanel />

        {/* Leaderboard Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🏆 Class Leaderboard</span>
              </CardTitle>
              <CardDescription>Top performers this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "You", points: 2450, badge: "🥇" },
                  { rank: 2, name: "Sarah Chen", points: 2380, badge: "🥈" },
                  { rank: 3, name: "Michael Lee", points: 2310, badge: "🥉" },
                  { rank: 4, name: "Emma Wilson", points: 2200, badge: "4️⃣" },
                  { rank: 5, name: "James Davis", points: 2150, badge: "5️⃣" },
                ].map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      entry.name === "You" ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{entry.badge}</span>
                      <div>
                        <p className="font-semibold text-foreground">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">Rank #{entry.rank}</p>
                      </div>
                    </div>
                    <p className="font-bold text-lg text-primary">{entry.points} pts</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenges Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⚡ Weekly Challenges</span>
              </CardTitle>
              <CardDescription>Complete challenges to earn bonus points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Quiz Master",
                    description: "Score 100% on 3 quizzes this week",
                    progress: 2,
                    target: 3,
                    reward: 500,
                  },
                  {
                    title: "Perfect Attendance",
                    description: "Attend all classes this week",
                    progress: 4,
                    target: 4,
                    reward: 300,
                    completed: true,
                  },
                  {
                    title: "Note Taker",
                    description: "Create 5 study notes",
                    progress: 3,
                    target: 5,
                    reward: 250,
                  },
                  {
                    title: "Creative Artist",
                    description: "Create 3 pieces with air drawing",
                    progress: 1,
                    target: 3,
                    reward: 400,
                  },
                ].map((challenge) => (
                  <div
                    key={challenge.title}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      challenge.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-muted border-border hover:border-primary"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{challenge.title}</h4>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      {challenge.completed && <span className="text-2xl">✅</span>}
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {challenge.progress}/{challenge.target}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-primary">+{challenge.reward} XP</span>
                      {!challenge.completed && (
                        <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                          Claim
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
