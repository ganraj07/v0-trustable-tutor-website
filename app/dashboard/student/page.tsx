"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { useUser } from "@/lib/user-context"
import {
  BrainIcon,
  SparklesIcon,
  CaptionsIcon,
  AudioIcon,
  HandIcon,
  BrailleIcon,
  NotesIcon,
  ChartIcon,
  DrawIcon,
  BookIcon,
  StarIcon,
} from "@/components/icons"
import { AIChatbot } from "@/components/ai-chatbot"

export default function StudentDashboard() {
  const router = useRouter()
  const { user, logout, updateAccessibilityPreferences } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const studentUser = user

  const quickActions = [
    {
      icon: CaptionsIcon,
      label: "Live Captions",
      color: "bg-primary/10 text-primary",
      href: "/dashboard/student/captions",
      enabled: studentUser.accessibilityPreferences.enableCaptions,
      toggle: () =>
        updateAccessibilityPreferences({ enableCaptions: !studentUser.accessibilityPreferences.enableCaptions }),
    },
    {
      icon: AudioIcon,
      label: "Audio Mode",
      color: "bg-secondary/10 text-secondary",
      href: "/dashboard/student/audio",
      enabled: studentUser.accessibilityPreferences.enableAudioMode,
      toggle: () =>
        updateAccessibilityPreferences({ enableAudioMode: !studentUser.accessibilityPreferences.enableAudioMode }),
    },
    {
      icon: HandIcon,
      label: "Sign Language",
      color: "bg-accent/10 text-accent",
      href: "/dashboard/student/sign-language",
      enabled: studentUser.accessibilityPreferences.enableSignLanguage,
      toggle: () =>
        updateAccessibilityPreferences({
          enableSignLanguage: !studentUser.accessibilityPreferences.enableSignLanguage,
        }),
    },
    {
      icon: BrailleIcon,
      label: "Braille Support",
      color: "bg-chart-5/20 text-chart-5",
      href: "/dashboard/student/braille",
      enabled: studentUser.accessibilityPreferences.enableBraille,
      toggle: () =>
        updateAccessibilityPreferences({ enableBraille: !studentUser.accessibilityPreferences.enableBraille }),
    },
    {
      icon: DrawIcon,
      label: "Air Drawing",
      color: "bg-primary/10 text-primary",
      href: "/dashboard/student/air-drawing",
    },
    { icon: NotesIcon, label: "My Notes", color: "bg-secondary/10 text-secondary", href: "/dashboard/student/notes" },
  ]

  const upcomingClasses = [
    { subject: "Mathematics", time: "9:00 AM", teacher: "Ms. Johnson", color: "bg-primary" },
    { subject: "Science", time: "10:30 AM", teacher: "Mr. Smith", color: "bg-secondary" },
    { subject: "English", time: "1:00 PM", teacher: "Ms. Davis", color: "bg-accent" },
  ]

  const recentAchievements = [
    { title: "Quiz Champion", description: "Scored 100% on Math Quiz", emoji: "trophy" },
    { title: "Note Taker", description: "Created 10 study notes", emoji: "note" },
    { title: "Active Learner", description: "7-day learning streak", emoji: "fire" },
  ]

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const getDisabilityLabel = (type: string) => {
    const labels: Record<string, string> = {
      none: "Standard",
      visual_impairment: "Visual Support",
      hearing_impairment: "Hearing Support",
      motor_disability: "Motor Support",
      cognitive_disability: "Cognitive Support",
      speech_disorder: "Speech Support",
      autism_spectrum: "ASD Support",
      dyslexia: "Dyslexia Support",
      adhd: "ADHD Support",
      multiple: "Multiple Supports",
    }
    return labels[type] || "Standard"
  }

  const getLanguageLabel = (lang: string) => {
    const labels: Record<string, string> = {
      english: "English",
      spanish: "Spanish",
      french: "French",
      german: "German",
      chinese: "Chinese",
      japanese: "Japanese",
      korean: "Korean",
      arabic: "Arabic",
      hindi: "Hindi",
      portuguese: "Portuguese",
      russian: "Russian",
      italian: "Italian",
    }
    return labels[lang] || "English"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <BrainIcon className="w-8 h-8 text-primary" />
                <SparklesIcon className="w-4 h-4 text-secondary absolute -top-1 -right-1" />
              </div>
              <span className="font-bold text-lg hidden sm:inline">
                Trustable Tutor<span className="text-primary">+</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
              <span className="text-xs font-medium text-primary">{getLanguageLabel(studentUser.language)}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full">
              <span className="text-xs font-medium text-secondary">
                {getDisabilityLabel(studentUser.disabilityType)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{studentUser.name.charAt(0)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-4 pt-20 lg:pt-4 space-y-2">
            <div className="p-4 bg-primary/10 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">{studentUser.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">{studentUser.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentUser.grade.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} | Age{" "}
                    {studentUser.age}
                  </p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <Link
                href="/dashboard/student"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium"
              >
                <ChartIcon className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/student/classes"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              >
                <BookIcon className="w-5 h-5" />
                My Classes
              </Link>
              <Link
                href="/dashboard/student/notes"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              >
                <NotesIcon className="w-5 h-5" />
                Notes & Materials
              </Link>
              <Link
                href="/dashboard/student/achievements"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              >
                <StarIcon className="w-5 h-5" />
                Achievements
              </Link>
            </nav>

            <div className="pt-4">
              <button
                onClick={() => {
                  logout()
                  router.push("/")
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Log Out
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {getGreeting()}, {studentUser.name.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">Ready for another awesome day of learning?</p>
          </div>

          {/* Accessibility Quick Toggles */}
          {studentUser.disabilityType !== "none" && (
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-primary" />
                  Your Accessibility Features
                </CardTitle>
                <CardDescription>Personalized for your learning needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {quickActions.slice(0, 4).map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background">
                      <div className="flex items-center gap-2">
                        <action.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{action.label}</span>
                      </div>
                      {"enabled" in action && <Switch checked={action.enabled} onCheckedChange={action.toggle} />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-card-foreground">{action.label}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Classes */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">Today's Classes</span>
                </CardTitle>
                <CardDescription>Your upcoming sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingClasses.map((cls, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div
                      className={`w-12 h-12 ${cls.color} rounded-xl flex items-center justify-center text-white font-bold`}
                    >
                      {cls.subject.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{cls.subject}</p>
                      <p className="text-sm text-muted-foreground">{cls.teacher}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{cls.time}</p>
                      <Button size="sm" className="mt-1">
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">My Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {studentUser.subjects.slice(0, 3).map((subject, index) => (
                  <div key={subject}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{subject.replace("_", " ")}</span>
                      <span className="text-sm text-muted-foreground">{85 - index * 10}%</span>
                    </div>
                    <Progress value={85 - index * 10} className="h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {recentAchievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <StarIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  )
}
