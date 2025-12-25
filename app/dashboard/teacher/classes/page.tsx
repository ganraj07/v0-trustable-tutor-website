"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useUser } from "@/lib/user-context"

export default function TeacherClassesPage() {
  const router = useRouter()
  const { user } = useUser()
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [classCode, setClassCode] = useState("")

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.push("/login?role=teacher")
    }
  }, [user, router])

  const classes = [
    { id: "1", subject: "Mathematics - Grade 5", time: "9:00 AM", students: 28, status: "live", code: "MATH5A" },
    { id: "2", subject: "Science - Grade 6", time: "10:30 AM", students: 32, status: "upcoming", code: "SCI6B" },
    { id: "3", subject: "Mathematics - Grade 4", time: "1:00 PM", students: 25, status: "upcoming", code: "MATH4C" },
  ]

  const startClass = (classId: string) => {
    const selectedClass = classes.find((c) => c.id === classId)
    if (selectedClass) {
      setClassCode(selectedClass.code)
      setSelectedClass(classId)
    }
  }

  if (!user || user.role !== "teacher") {
    return null
  }

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
            <span className="font-bold text-lg">My Classes</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 lg:p-8">
        {!selectedClass ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">All Classes</h2>
            <div className="grid gap-4">
              {classes.map((cls) => (
                <Card key={cls.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-lg">{cls.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {cls.time} | {cls.students} students
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${cls.status === "live" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {cls.status === "live" ? "LIVE" : "Upcoming"}
                        </span>
                        <Button
                          onClick={() => startClass(cls.id)}
                          className={
                            cls.status === "live" ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
                          }
                        >
                          {cls.status === "live" ? "Join Live" : "Prepare Class"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Class Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="font-bold">Class Code for Students:</Label>
                <p className="text-2xl font-mono mt-2">{classCode}</p>
              </div>
              <div className="space-y-4">
                <Button className="w-full" disabled>
                  Start Broadcasting (Feature Coming Soon)
                </Button>
                <Button onClick={() => setSelectedClass(null)} variant="outline" className="w-full">
                  Back to Classes
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
