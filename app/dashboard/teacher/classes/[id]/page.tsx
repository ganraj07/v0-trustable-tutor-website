"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"

interface StudentInClass {
  id: number
  name: string
  status: "present" | "absent" | "late"
  participationScore: number
  avatar: string
}

export default function ClassDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useUser()
  const classId = params.id as string

  const [classActive, setClassActive] = useState(false)
  const [students, setStudents] = useState<StudentInClass[]>([
    { id: 1, name: "Emma Wilson", status: "present", participationScore: 85, avatar: "E" },
    { id: 2, name: "James Lee", status: "present", participationScore: 90, avatar: "J" },
    { id: 3, name: "Sophie Chen", status: "late", participationScore: 75, avatar: "S" },
    { id: 4, name: "Michael Brown", status: "present", participationScore: 88, avatar: "M" },
    { id: 5, name: "Ava Davis", status: "absent", participationScore: 0, avatar: "A" },
  ])
  const [classCode] = useState("CLASS-" + classId.toUpperCase())

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.push("/login?role=teacher")
    }
  }, [user, router])

  if (!user || user.role !== "teacher") {
    return null
  }

  const classDetails = {
    [1]: { subject: "Mathematics - Grade 5", time: "9:00 AM", duration: 45 },
    [2]: { subject: "Science - Grade 6", time: "10:30 AM", duration: 45 },
    [3]: { subject: "Mathematics - Grade 4", time: "1:00 PM", duration: 45 },
  }

  const currentClass = (classDetails as any)[classId] || { subject: "Class", time: "N/A", duration: 45 }

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
            <div>
              <h1 className="font-bold text-lg">{currentClass.subject}</h1>
              <p className="text-sm text-muted-foreground">{currentClass.time}</p>
            </div>
          </div>
          <div
            className={`px-4 py-2 rounded-full font-medium ${classActive ? "bg-green-500/20 text-green-700" : "bg-yellow-500/20 text-yellow-700"}`}
          >
            {classActive ? "Class Active" : "Class Not Started"}
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-6xl mx-auto">
        <div className="grid gap-6">
          {/* Class Control Section */}
          <Card>
            <CardHeader>
              <CardTitle>Class Control</CardTitle>
              <CardDescription>Manage your live class session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Class Code</p>
                <p className="text-2xl font-bold text-foreground">{classCode}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setClassActive(!classActive)}
                  className={classActive ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"}
                >
                  {classActive ? "End Class" : "Start Class"}
                </Button>
                <Button variant="outline">Share Screen</Button>
                <Button variant="outline">Record Session</Button>
              </div>
            </CardContent>
          </Card>

          {/* Students in Class */}
          <Card>
            <CardHeader>
              <CardTitle>Students ({students.length})</CardTitle>
              <CardDescription>Real-time attendance and participation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                        {student.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">Participation: {student.participationScore}%</p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        student.status === "present"
                          ? "bg-green-500/20 text-green-700"
                          : student.status === "late"
                            ? "bg-yellow-500/20 text-yellow-700"
                            : "bg-red-500/20 text-red-700"
                      }`}
                    >
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Class Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Class Notes</CardTitle>
              <CardDescription>Add notes for this session</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Write class notes here..."
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground"
                rows={5}
              />
              <Button className="mt-3">Save Notes</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
