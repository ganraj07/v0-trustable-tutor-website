"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/lib/user-context"
import {
  BrainIcon,
  SparklesIcon,
  DashboardIcon,
  RequestIcon,
  UploadIcon,
  EngagementIcon,
  BookIcon,
} from "@/components/icons"
import { AIChatbot } from "@/components/ai-chatbot"

export default function TeacherDashboard() {
  const router = useRouter()
  const { user, logout } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [todayClasses, setTodayClasses] = useState([
    { subject: "Mathematics - Grade 5", time: "9:00 AM", students: 28, status: "upcoming", color: "bg-primary" },
    { subject: "Science - Grade 6", time: "10:30 AM", students: 32, status: "upcoming", color: "bg-secondary" },
    { subject: "Mathematics - Grade 4", time: "1:00 PM", students: 25, status: "upcoming", color: "bg-accent" },
  ])
  const [studentRequests, setStudentRequests] = useState([
    {
      id: 1,
      name: "Emma Wilson",
      type: "Doubt",
      subject: "Fractions",
      time: "5 min ago",
      avatar: "E",
      resolved: false,
    },
    {
      id: 2,
      name: "James Lee",
      type: "Permission",
      subject: "Leave early",
      time: "10 min ago",
      avatar: "J",
      resolved: false,
    },
    {
      id: 3,
      name: "Sophie Chen",
      type: "Support",
      subject: "Audio issues",
      time: "15 min ago",
      avatar: "S",
      resolved: false,
    },
  ])
  const [classStats, setClassStats] = useState([
    { label: "Total Students", value: "156", icon: "students", color: "bg-primary/10 text-primary" },
    { label: "Classes Today", value: "4", icon: "classes", color: "bg-secondary/10 text-secondary" },
    { label: "Avg. Attendance", value: "94%", icon: "attendance", color: "bg-accent/10 text-accent" },
    { label: "Materials Shared", value: "48", icon: "materials", color: "bg-chart-5/20 text-chart-5" },
  ])

  useEffect(() => {
    if (user && user.role === "teacher") {
      setTodayClasses([
        {
          subject: `${user.subjects[0]?.replace("_", " ") || "Mathematics"} - Grade 5`,
          time: "9:00 AM",
          students: 28,
          status: "upcoming",
          color: "bg-primary",
        },
        {
          subject: `${user.subjects[0]?.replace("_", " ") || "Science"} - Grade 6`,
          time: "10:30 AM",
          students: 32,
          status: "upcoming",
          color: "bg-secondary",
        },
        {
          subject: `${user.subjects[1]?.replace("_", " ") || "Mathematics"} - Grade 4`,
          time: "1:00 PM",
          students: 25,
          status: "upcoming",
          color: "bg-accent",
        },
      ])
    }
    if (!user || user.role !== "teacher") {
      router.push("/login?role=teacher")
    }
  }, [user, router])

  if (!user || user.role !== "teacher") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-secondary border-t-transparent rounded-full" />
      </div>
    )
  }

  const teacherUser = user

  const handleResolveRequest = (id: number) => {
    setStudentRequests((prev) => prev.map((req) => (req.id === id ? { ...req, resolved: true } : req)))
  }

  const handleFileUpload = () => {
    if (selectedFile) {
      // Simulate upload
      setUploadDialogOpen(false)
      setSelectedFile(null)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
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
                <BrainIcon className="w-8 h-8 text-secondary" />
                <SparklesIcon className="w-4 h-4 text-primary absolute -top-1 -right-1" />
              </div>
              <span className="font-bold text-lg hidden sm:inline">
                Trustable Tutor<span className="text-secondary">+</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90">
                  <UploadIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Upload Content</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Learning Material</DialogTitle>
                  <DialogDescription>Share study materials with your students</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Material Title</Label>
                    <Input id="title" placeholder="Enter title..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe the material..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">File</Label>
                    <Input id="file" type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                  </div>
                  <Button onClick={handleFileUpload} className="w-full bg-secondary hover:bg-secondary/90">
                    Upload Material
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-secondary">{teacherUser.name.charAt(0)}</span>
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
            <div className="p-4 bg-secondary/10 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-2xl font-bold text-secondary-foreground">{teacherUser.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-bold text-foreground">{teacherUser.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {teacherUser.subjects[0]?.replace("_", " ")} Teacher
                  </p>
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              <Link
                href="/dashboard/teacher"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/10 text-secondary font-medium"
              >
                <DashboardIcon className="w-5 h-5" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/teacher/classes"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              >
                <BookIcon className="w-5 h-5" />
                My Classes
              </Link>
              <Link
                href="/dashboard/teacher/requests"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              >
                <RequestIcon className="w-5 h-5" />
                Student Requests
                <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                  {studentRequests.filter((r) => !r.resolved).length}
                </span>
              </Link>
              <Link
                href="/dashboard/teacher/materials"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              >
                <UploadIcon className="w-5 h-5" />
                Materials
              </Link>
              <Link
                href="/dashboard/teacher/analytics"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors"
              >
                <EngagementIcon className="w-5 h-5" />
                Analytics
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
              {getGreeting()}, {teacherUser.name.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">Here's what's happening with your classes today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {classStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                      {stat.icon === "students" && <EngagementIcon className="w-6 h-6" />}
                      {stat.icon === "classes" && <BookIcon className="w-6 h-6" />}
                      {stat.icon === "attendance" && <DashboardIcon className="w-6 h-6" />}
                      {stat.icon === "materials" && <UploadIcon className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Classes */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">Today's Classes</span>
                  </CardTitle>
                  <CardDescription>Manage your live sessions</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayClasses.map((cls, index) => (
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
                      <p className="font-semibold text-foreground capitalize">{cls.subject}</p>
                      <p className="text-sm text-muted-foreground">{cls.students} students enrolled</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{cls.time}</p>
                      <Button size="sm" className="mt-1 bg-secondary hover:bg-secondary/90">
                        Start Class
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Student Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">Student Requests</span>
                </CardTitle>
                <CardDescription>Pending queries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {studentRequests
                  .filter((r) => !r.resolved)
                  .map((request) => (
                    <div key={request.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                        {request.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{request.name}</p>
                        <p className="text-sm text-muted-foreground">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mr-2">
                            {request.type}
                          </span>
                          {request.subject}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs bg-transparent"
                            onClick={() => handleResolveRequest(request.id)}
                          >
                            Resolve
                          </Button>
                          <span className="text-xs text-muted-foreground">{request.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                {studentRequests.filter((r) => !r.resolved).length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No pending requests</p>
                )}
                <Button variant="outline" className="w-full bg-transparent">
                  View All Requests
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Engagement Analytics Preview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">Class Engagement Overview</span>
              </CardTitle>
              <CardDescription>Student participation across your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-6">
                {teacherUser.grades.slice(0, 3).map((grade, index) => (
                  <div key={grade}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{grade.replace("-", " ")}</span>
                      <span className="text-sm text-muted-foreground">{92 - index * 4}%</span>
                    </div>
                    <Progress value={92 - index * 4} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">{28 + index * 4} active students</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Weekly Insight</p>
                    <p className="text-sm text-muted-foreground">Student engagement increased by 12% this week!</p>
                  </div>
                  <SparklesIcon className="w-8 h-8 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  )
}
