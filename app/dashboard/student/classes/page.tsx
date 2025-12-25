"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"

export default function StudentClassesPage() {
  const router = useRouter()
  const { user } = useUser()

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  if (!user || user.role !== "student") {
    return null
  }

  const classes = [
    { id: "1", subject: "Mathematics", time: "9:00 AM", teacher: "Ms. Johnson", students: 28 },
    { id: "2", subject: "Science", time: "10:30 AM", teacher: "Mr. Smith", students: 32 },
    { id: "3", subject: "English", time: "1:00 PM", teacher: "Ms. Davis", students: 25 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center gap-4 px-4 py-3">
          <Link href="/dashboard/student" className="p-2 rounded-lg hover:bg-muted transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="font-bold text-lg">My Classes</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 lg:p-8">
        <div className="grid gap-4">
          {classes.map((cls) => (
            <Card key={cls.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg">{cls.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {cls.teacher} | {cls.students} students
                    </p>
                  </div>
                  <p className="font-semibold">{cls.time}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
