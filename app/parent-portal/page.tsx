"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BrainIcon, SparklesIcon, VolumeIcon } from "@/components/icons"

export default function ParentPortal() {
  const [selectedStudent, setSelectedStudent] = useState("emma")
  const [voiceReportActive, setVoiceReportActive] = useState(false)

  const students = {
    emma: {
      name: "Emma Johnson",
      grade: "Grade 5",
      avatar: "E",
      overallProgress: 85,
      subjects: [
        { name: "Mathematics", progress: 88, status: "Excellent" },
        { name: "Science", progress: 82, status: "Good" },
        { name: "English", progress: 85, status: "Good" },
        { name: "History", progress: 78, status: "Good" },
      ],
      recentActivities: [
        { date: "Today", activity: "Completed Mathematics Quiz - 95%", type: "achievement" },
        { date: "Yesterday", activity: "Attended 4/4 classes", type: "activity" },
        { date: "2 days ago", activity: "Earned 'Quiz Master' badge", type: "achievement" },
      ],
      weeklyReport: {
        classesAttended: 18,
        questionsAsked: 12,
        notesCreated: 8,
        averageScore: 87,
      },
      accessibilityNeeds: "Visual Support - Uses captions and enlarged text",
    },
    john: {
      name: "John Smith",
      grade: "Grade 4",
      avatar: "J",
      overallProgress: 76,
      subjects: [
        { name: "Mathematics", progress: 75, status: "Good" },
        { name: "Science", progress: 78, status: "Good" },
        { name: "English", progress: 74, status: "Needs Improvement" },
        { name: "Art", progress: 92, status: "Excellent" },
      ],
      recentActivities: [
        { date: "Today", activity: "Used air drawing tool - created 2 artworks", type: "activity" },
        { date: "Yesterday", activity: "Attended 3/4 classes", type: "activity" },
        { date: "3 days ago", activity: "Completed Science Project", type: "achievement" },
      ],
      weeklyReport: {
        classesAttended: 14,
        questionsAsked: 8,
        notesCreated: 5,
        averageScore: 76,
      },
      accessibilityNeeds: "Motor Support - Uses gesture controls and voice commands",
    },
  }

  const currentStudent = students[selectedStudent as keyof typeof students]

  const generateVoiceReport = () => {
    setVoiceReportActive(true)
    // Simulate voice synthesis
    const message = `Progress report for ${currentStudent.name}. Overall progress is ${currentStudent.overallProgress} percent. 
    Mathematics: ${currentStudent.subjects[0].progress} percent. 
    Science: ${currentStudent.subjects[1].progress} percent. 
    English: ${currentStudent.subjects[2].progress} percent. 
    This week, ${currentStudent.name} attended ${currentStudent.weeklyReport.classesAttended} classes, 
    asked ${currentStudent.weeklyReport.questionsAsked} questions, and created ${currentStudent.weeklyReport.notesCreated} notes. 
    Average score is ${currentStudent.weeklyReport.averageScore} percent.`

    // Use Web Speech API
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 0.9
      speechSynthesis.cancel()
      speechSynthesis.speak(utterance)
      setTimeout(() => setVoiceReportActive(false), 15000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <BrainIcon className="w-8 h-8 text-primary" />
              <SparklesIcon className="w-4 h-4 text-secondary absolute -top-1 -right-1" />
            </div>
            <span className="font-bold text-lg">
              Trustable Tutor<span className="text-primary">+</span> Parent Portal
            </span>
          </Link>
          <Link href="/">
            <Button variant="outline">Back Home</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Student Selector */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">My Child's Learning</h1>
          <div className="flex gap-3">
            {Object.entries(students).map(([key, student]) => (
              <button
                key={key}
                onClick={() => setSelectedStudent(key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedStudent === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {student.name}
              </button>
            ))}
          </div>
        </div>

        {/* Student Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {/* Overall Progress */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Overall Progress</h3>
                <p className="text-3xl font-bold text-foreground">{currentStudent.overallProgress}%</p>
              </div>
              <Progress value={currentStudent.overallProgress} className="h-3" />
            </CardContent>
          </Card>

          {/* Grade & Accessibility */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Grade Level</p>
                <p className="text-2xl font-bold text-foreground">{currentStudent.grade}</p>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Accessibility Support</p>
                <p className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full inline-block">
                  {currentStudent.accessibilityNeeds}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Voice Report */}
          <Card>
            <CardContent className="p-6">
              <Button
                onClick={generateVoiceReport}
                className="w-full flex items-center gap-2"
                disabled={voiceReportActive}
              >
                <VolumeIcon className="w-4 h-4" />
                {voiceReportActive ? "Playing Report..." : "Generate Voice Report"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Listen to a personalized progress report for {currentStudent.name.split(" ")[0]}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Progress in each subject</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStudent.subjects.map((subject) => (
                <div key={subject.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">{subject.name}</span>
                    <span className="text-sm font-bold text-primary">{subject.progress}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={subject.progress} className="h-3 flex-1" />
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {subject.status}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card>
            <CardHeader>
              <CardTitle>This Week's Summary</CardTitle>
              <CardDescription>Learning activities and performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Classes Attended</p>
                  <p className="text-2xl font-bold text-primary">{currentStudent.weeklyReport.classesAttended}</p>
                </div>
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Questions Asked</p>
                  <p className="text-2xl font-bold text-secondary">{currentStudent.weeklyReport.questionsAsked}</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Notes Created</p>
                  <p className="text-2xl font-bold text-accent">{currentStudent.weeklyReport.notesCreated}</p>
                </div>
                <div className="p-3 bg-chart-1/20 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-chart-1">{currentStudent.weeklyReport.averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>What {currentStudent.name.split(" ")[0]} has been up to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentStudent.recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                    {activity.type === "achievement" ? "🏆" : "📚"}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{activity.activity}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Educational Tips */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>💡 Parent Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Supporting Their Learning</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Review their study notes together</li>
                  <li>Celebrate their achievements and badges</li>
                  <li>Encourage regular class attendance</li>
                  <li>Discuss what they're learning daily</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Accessibility Support</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Ensure comfortable learning environment</li>
                  <li>Check their accessibility settings</li>
                  <li>Monitor their interaction with features</li>
                  <li>Report any technical issues to teachers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
