"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getNextLevelExp, getStreakBonus, badges, type GamificationData } from "@/lib/gamification-system"

export function GamificationPanel() {
  const [gamificationData, setGamificationData] = useState<GamificationData>({
    totalPoints: 2450,
    level: 5,
    experiencePoints: 2450,
    streak: 12,
    badges: [
      { ...badges.note_keeper, unlockedAt: new Date() },
      { ...badges.attendance_star, unlockedAt: new Date() },
    ],
    rewards: [
      {
        id: "1",
        title: "Weekly Challenge Champion",
        description: "Completed all weekly challenges",
        earnedAt: new Date(),
        type: "achievement",
      },
    ],
  })

  const nextLevelExp = getNextLevelExp(gamificationData.experiencePoints)
  const progressToNextLevel = ((gamificationData.experiencePoints % 500) / 500) * 100
  const streakBonus = getStreakBonus(gamificationData.streak)

  return (
    <div className="space-y-6">
      {/* Level & Experience */}
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Level {gamificationData.level}</h3>
              <p className="text-sm text-muted-foreground">Learning Journey</p>
            </div>
            <div className="text-5xl">⭐</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Experience Progress</span>
              <span className="font-medium">{gamificationData.experiencePoints % 500}/500 XP</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-2 bg-background rounded-lg">
                <p className="text-muted-foreground">Total Points</p>
                <p className="font-bold text-primary">{gamificationData.totalPoints}</p>
              </div>
              <div className="p-2 bg-background rounded-lg">
                <p className="text-muted-foreground">Current Streak</p>
                <p className="font-bold text-secondary">{gamificationData.streak} days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak Bonus */}
      {gamificationData.streak > 0 && (
        <Card className="border-secondary/20 bg-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">Streak Bonus Active</p>
                <p className="text-sm text-muted-foreground">+{streakBonus}% XP multiplier</p>
              </div>
              <div className="text-3xl">🔥</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Badges Earned</CardTitle>
          <CardDescription>Unlock more by completing challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {gamificationData.badges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
                title={badge.description}
              >
                <span className="text-4xl mb-2">{badge.icon}</span>
                <span className="text-xs font-medium text-center line-clamp-2">{badge.name}</span>
              </div>
            ))}
            {/* Locked badges preview */}
            {Object.values(badges)
              .filter((b) => !gamificationData.badges.find((ub) => ub.id === b.id))
              .slice(0, 4)
              .map((badge) => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center p-3 rounded-lg bg-muted/30 opacity-50"
                  title={`Locked: ${badge.description}`}
                >
                  <span className="text-4xl mb-2 blur-sm">{badge.icon}</span>
                  <span className="text-xs font-medium text-center text-muted-foreground line-clamp-2">🔒</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Rewards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {gamificationData.rewards.map((reward) => (
            <div key={reward.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-2xl">🎁</span>
              <div className="flex-1">
                <p className="font-medium text-foreground">{reward.title}</p>
                <p className="text-sm text-muted-foreground">{reward.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
