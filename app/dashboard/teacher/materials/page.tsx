"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/lib/user-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Material {
  id: string
  title: string
  description: string
  uploadedAt: string
}

export default function MaterialsPage() {
  const router = useRouter()
  const { user } = useUser()
  const [materials, setMaterials] = useState<Material[]>([
    { id: "1", title: "Chapter 5 - Fractions", description: "Complete guide to fractions", uploadedAt: "2 days ago" },
    { id: "2", title: "Quiz 1 Solutions", description: "Solutions for practice quiz", uploadedAt: "5 days ago" },
  ])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.push("/login?role=teacher")
    }
  }, [user, router])

  const uploadMaterial = () => {
    if (title && description) {
      setMaterials([...materials, { id: Date.now().toString(), title, description, uploadedAt: "just now" }])
      setTitle("")
      setDescription("")
      setDialogOpen(false)
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
            <span className="font-bold text-lg">Learning Materials</span>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Upload Material</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Learning Material</DialogTitle>
                <DialogDescription>Share study materials with your students</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Material title..."
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the material..."
                  />
                </div>
                <Button onClick={uploadMaterial} className="w-full">
                  Upload
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 lg:p-8">
        <div className="grid gap-4">
          {materials.map((material) => (
            <Card key={material.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-lg">{material.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Uploaded {material.uploadedAt}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
