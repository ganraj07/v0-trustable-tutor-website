"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type DisabilityType =
  | "none"
  | "visual_impairment"
  | "hearing_impairment"
  | "motor_disability"
  | "cognitive_disability"
  | "speech_disorder"
  | "autism_spectrum"
  | "dyslexia"
  | "adhd"
  | "multiple"

export type Subject =
  | "mathematics"
  | "science"
  | "english"
  | "history"
  | "geography"
  | "art"
  | "music"
  | "physical_education"
  | "computer_science"

export type Language =
  | "english"
  | "spanish"
  | "french"
  | "german"
  | "chinese"
  | "japanese"
  | "korean"
  | "arabic"
  | "hindi"
  | "portuguese"
  | "russian"
  | "italian"

export type Religion =
  | "prefer_not_to_say"
  | "christianity"
  | "islam"
  | "hinduism"
  | "buddhism"
  | "judaism"
  | "sikhism"
  | "other"
  | "none"

export interface StudentProfile {
  id: string
  name: string
  email: string
  role: "student"
  age: number
  grade: string
  subjects: Subject[]
  disabilityType: DisabilityType
  language: Language
  religion: Religion
  accessibilityPreferences: {
    enableCaptions: boolean
    enableAudioMode: boolean
    enableSignLanguage: boolean
    enableBraille: boolean
    textSize: "small" | "medium" | "large" | "extra-large"
    highContrast: boolean
    reducedMotion: boolean
    speechRate: number
  }
}

export interface TeacherProfile {
  id: string
  name: string
  email: string
  role: "teacher"
  age: number
  subjects: Subject[]
  grades: string[]
  language: Language
  religion: Religion
}

export type UserProfile = StudentProfile | TeacherProfile | null

interface UserContextType {
  user: UserProfile
  setUser: (user: UserProfile) => void
  login: (userData: UserProfile) => void
  logout: () => void
  updateAccessibilityPreferences: (prefs: Partial<StudentProfile["accessibilityPreferences"]>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("trustable_tutor_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (userData: UserProfile) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem("trustable_tutor_user", JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("trustable_tutor_user")
  }

  const updateAccessibilityPreferences = (prefs: Partial<StudentProfile["accessibilityPreferences"]>) => {
    if (user && user.role === "student") {
      const updatedUser = {
        ...user,
        accessibilityPreferences: {
          ...user.accessibilityPreferences,
          ...prefs,
        },
      }
      setUser(updatedUser)
      localStorage.setItem("trustable_tutor_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, updateAccessibilityPreferences }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
