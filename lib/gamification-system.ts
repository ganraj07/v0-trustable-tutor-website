// Gamification system types and utilities
export type BadgeType =
  | "quiz_master"
  | "note_keeper"
  | "attendance_star"
  | "question_asker"
  | "team_player"
  | "speed_learner"
  | "persistence"
  | "creativity"

export interface Badge {
  id: BadgeType
  name: string
  description: string
  icon: string
  unlockedAt?: Date
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
}

export interface GamificationData {
  totalPoints: number
  level: number
  experiencePoints: number
  streak: number
  badges: Badge[]
  rewards: {
    id: string
    title: string
    description: string
    earnedAt: Date
    type: "badge" | "certificate" | "achievement"
  }[]
}

export const badges: Record<BadgeType, Badge> = {
  quiz_master: {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Scored 100% on 5 quizzes",
    icon: "🎓",
    rarity: "rare",
  },
  note_keeper: {
    id: "note_keeper",
    name: "Note Keeper",
    description: "Created 10 comprehensive notes",
    icon: "📝",
    rarity: "uncommon",
  },
  attendance_star: {
    id: "attendance_star",
    name: "Attendance Star",
    description: "100% attendance for a month",
    icon: "⭐",
    rarity: "common",
  },
  question_asker: {
    id: "question_asker",
    name: "Question Asker",
    description: "Asked 20 insightful questions",
    icon: "❓",
    rarity: "uncommon",
  },
  team_player: {
    id: "team_player",
    name: "Team Player",
    description: "Helped 5 classmates",
    icon: "🤝",
    rarity: "uncommon",
  },
  speed_learner: {
    id: "speed_learner",
    name: "Speed Learner",
    description: "Completed lesson 50% faster",
    icon: "⚡",
    rarity: "rare",
  },
  persistence: {
    id: "persistence",
    name: "Persistence",
    description: "Maintained 30-day learning streak",
    icon: "🔥",
    rarity: "epic",
  },
  creativity: {
    id: "creativity",
    name: "Creative Genius",
    description: "Created 5 unique art pieces with air drawing",
    icon: "🎨",
    rarity: "epic",
  },
}

export const calculateLevel = (exp: number): number => {
  return Math.floor(exp / 500) + 1
}

export const getNextLevelExp = (currentExp: number): number => {
  const currentLevel = calculateLevel(currentExp)
  return currentLevel * 500
}

export const getStreakBonus = (streak: number): number => {
  return streak <= 0 ? 0 : Math.min(streak * 10, 100)
}
