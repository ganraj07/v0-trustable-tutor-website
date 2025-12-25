"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useUser } from "@/lib/user-context"
import { NotesIcon, SparklesIcon } from "@/components/icons"

interface Note {
  id: string
  title: string
  content: string
  subject: string
  createdAt: Date
  isAIGenerated: boolean
}

export default function NotesPage() {
  const router = useRouter()
  const { user } = useUser()
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Introduction to Fractions",
      content:
        "A fraction represents a part of a whole. Key concepts:\n\n1. Numerator (top number) - parts we have\n2. Denominator (bottom number) - total equal parts\n3. Equivalent fractions have the same value\n4. To add fractions, they need common denominators",
      subject: "Mathematics",
      createdAt: new Date(Date.now() - 86400000),
      isAIGenerated: true,
    },
    {
      id: "2",
      title: "Water Cycle Notes",
      content:
        "The water cycle has 4 main stages:\n\n1. Evaporation - water turns to vapor\n2. Condensation - vapor forms clouds\n3. Precipitation - water falls as rain/snow\n4. Collection - water gathers in bodies of water",
      subject: "Science",
      createdAt: new Date(Date.now() - 172800000),
      isAIGenerated: true,
    },
  ])
  const [newNoteOpen, setNewNoteOpen] = useState(false)
  const [newNote, setNewNote] = useState({ title: "", content: "", subject: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [generatingNotes, setGeneratingNotes] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  const handleCreateNote = () => {
    if (!newNote.title || !newNote.content) return

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      subject: newNote.subject || "General",
      createdAt: new Date(),
      isAIGenerated: false,
    }

    setNotes((prev) => [note, ...prev])
    setNewNote({ title: "", content: "", subject: "" })
    setNewNoteOpen(false)
  }

  const handleGenerateAINotes = async () => {
    setGeneratingNotes(true)
    // Simulate AI note generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const aiNote: Note = {
      id: Date.now().toString(),
      title: "AI Summary: Today's Class",
      content:
        "Key points from today's lesson:\n\n1. We learned about algebraic expressions\n2. Variables represent unknown values\n3. Coefficients multiply variables\n4. Like terms can be combined\n5. Order of operations: PEMDAS\n\nPractice problems assigned: Page 45, exercises 1-10",
      subject: "Mathematics",
      createdAt: new Date(),
      isAIGenerated: true,
    }

    setNotes((prev) => [aiNote, ...prev])
    setGeneratingNotes(false)
  }

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!user || user.role !== "student") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/student" className="p-2 rounded-lg hover:bg-muted transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <NotesIcon className="w-6 h-6 text-secondary" />
              <span className="font-bold text-lg">Smart AI Notes</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleGenerateAINotes}
              disabled={generatingNotes}
              className="hidden sm:flex bg-transparent"
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              {generatingNotes ? "Generating..." : "Generate AI Notes"}
            </Button>
            <Dialog open={newNoteOpen} onOpenChange={setNewNoteOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Note</DialogTitle>
                  <DialogDescription>Add a new study note</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={newNote.title}
                      onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Note title..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      value={newNote.subject}
                      onChange={(e) => setNewNote((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="e.g., Mathematics, Science..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Content</Label>
                    <Textarea
                      value={newNote.content}
                      onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your notes here..."
                      className="min-h-[200px]"
                    />
                  </div>
                  <Button onClick={handleCreateNote} className="w-full">
                    Create Note
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-5xl mx-auto">
        {/* Search */}
        <div className="mb-6">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="max-w-md"
          />
        </div>

        {/* Notes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base line-clamp-1">{note.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{note.subject}</span>
                      {note.isAIGenerated && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                          <SparklesIcon className="w-3 h-3 mr-1" />
                          AI
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-6">{note.content}</p>
                <p className="text-xs text-muted-foreground mt-3">{note.createdAt.toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <NotesIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notes found. Create your first note!</p>
          </div>
        )}
      </main>
    </div>
  )
}
