"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useUser } from "@/lib/user-context"

interface StudentRequest {
  id: number
  name: string
  type: string
  subject: string
  time: string
  resolved: boolean
}

export default function StudentRequestsPage() {
  const router = useRouter()
  const { user } = useUser()
  const [requests, setRequests] = useState<StudentRequest[]>([
    { id: 1, name: "Emma Wilson", type: "Doubt", subject: "Fractions", time: "5 min ago", resolved: false },
    { id: 2, name: "James Lee", type: "Permission", subject: "Leave early", time: "10 min ago", resolved: false },
    { id: 3, name: "Sophie Chen", type: "Support", subject: "Audio issues", time: "15 min ago", resolved: false },
  ])

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.push("/login?role=teacher")
    }
  }, [user, router])

  const resolveRequest = (id: number) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, resolved: true } : r)))
  }

  if (!user || user.role !== "teacher") {
    return null
  }

  const pendingRequests = requests.filter((r) => !r.resolved)

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
            <span className="font-bold text-lg">Student Requests</span>
          </div>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
            {pendingRequests.length} Pending
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 lg:p-8">
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground text-lg">No pending student requests</p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-lg">{request.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                          {request.type}
                        </span>
                        <span className="text-sm text-muted-foreground">{request.subject}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{request.time}</p>
                    </div>
                    <Button onClick={() => resolveRequest(request.id)} className="bg-green-600 hover:bg-green-700">
                      Mark Resolved
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
