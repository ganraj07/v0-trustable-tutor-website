"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useUser, type StudentProfile } from "@/lib/user-context"
import { SparklesIcon } from "@/components/icons"

export default function SettingsPage() {
  const router = useRouter()
  const { user, updateAccessibilityPreferences } = useUser()

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login?role=student")
    }
  }, [user, router])

  if (!user || user.role !== "student") {
    return null
  }

  const studentUser = user as StudentProfile
  const prefs = studentUser.accessibilityPreferences

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
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-bold text-lg">Accessibility Settings</span>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 lg:p-8 max-w-3xl mx-auto">
        <div className="space-y-6">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{studentUser.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{studentUser.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Age</Label>
                  <p className="font-medium">{studentUser.age} years</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Grade</Label>
                  <p className="font-medium capitalize">{studentUser.grade.replace("-", " ")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Features */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-primary" />
                Accessibility Features
              </CardTitle>
              <CardDescription>Customize your learning experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Live Captions</Label>
                  <p className="text-sm text-muted-foreground">Convert speech to text in real-time</p>
                </div>
                <Switch
                  checked={prefs.enableCaptions}
                  onCheckedChange={(checked) => updateAccessibilityPreferences({ enableCaptions: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Audio Learning Mode</Label>
                  <p className="text-sm text-muted-foreground">Text-to-speech for all content</p>
                </div>
                <Switch
                  checked={prefs.enableAudioMode}
                  onCheckedChange={(checked) => updateAccessibilityPreferences({ enableAudioMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Sign Language Support</Label>
                  <p className="text-sm text-muted-foreground">Enable gesture recognition</p>
                </div>
                <Switch
                  checked={prefs.enableSignLanguage}
                  onCheckedChange={(checked) => updateAccessibilityPreferences({ enableSignLanguage: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Braille Support</Label>
                  <p className="text-sm text-muted-foreground">Compatible with Braille displays</p>
                </div>
                <Switch
                  checked={prefs.enableBraille}
                  onCheckedChange={(checked) => updateAccessibilityPreferences({ enableBraille: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Visual Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Settings</CardTitle>
              <CardDescription>Adjust display preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Text Size</Label>
                <Select
                  value={prefs.textSize}
                  onValueChange={(value: "small" | "medium" | "large" | "extra-large") =>
                    updateAccessibilityPreferences({ textSize: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extra-large">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>High Contrast Mode</Label>
                  <p className="text-sm text-muted-foreground">Increase visual contrast</p>
                </div>
                <Switch
                  checked={prefs.highContrast}
                  onCheckedChange={(checked) => updateAccessibilityPreferences({ highContrast: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">Minimize animations</p>
                </div>
                <Switch
                  checked={prefs.reducedMotion}
                  onCheckedChange={(checked) => updateAccessibilityPreferences({ reducedMotion: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Speech Rate: {prefs.speechRate.toFixed(1)}x</Label>
                <Slider
                  value={[prefs.speechRate]}
                  onValueChange={([value]) => updateAccessibilityPreferences({ speechRate: value })}
                  min={0.5}
                  max={2}
                  step={0.1}
                />
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/dashboard/student")}>
            Save and Return to Dashboard
          </Button>
        </div>
      </main>
    </div>
  )
}
