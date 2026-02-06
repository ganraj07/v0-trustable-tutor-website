"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"
import { BraileTypingInterface } from "@/components/braille-typing-interface"
import { ArrowLeftIcon } from "@/components/icons"

export default function BrailleTypingPage() {
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
    <div>
      {/* Back Button */}
      <div className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur z-40 border-b p-4">
        <Link href="/dashboard/student">
          <Button variant="ghost" className="gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <BraileTypingInterface />
    </div>
  )
}
