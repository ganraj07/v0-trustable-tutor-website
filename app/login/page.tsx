"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BrainIcon, SparklesIcon, GraduationIcon, BookIcon } from "@/components/icons"
import {
  useUser,
  type DisabilityType,
  type Subject,
  type StudentProfile,
  type TeacherProfile,
  type Language,
  type Religion,
} from "@/lib/user-context"

const AGE_OPTIONS = Array.from({ length: 18 }, (_, i) => i + 5)

const GRADE_OPTIONS = [
  { value: "kindergarten", label: "Kindergarten" },
  { value: "grade-1", label: "Grade 1" },
  { value: "grade-2", label: "Grade 2" },
  { value: "grade-3", label: "Grade 3" },
  { value: "grade-4", label: "Grade 4" },
  { value: "grade-5", label: "Grade 5" },
  { value: "grade-6", label: "Grade 6" },
  { value: "grade-7", label: "Grade 7" },
  { value: "grade-8", label: "Grade 8" },
  { value: "grade-9", label: "Grade 9" },
  { value: "grade-10", label: "Grade 10" },
  { value: "grade-11", label: "Grade 11" },
  { value: "grade-12", label: "Grade 12" },
]

const SUBJECT_OPTIONS: { value: Subject; label: string }[] = [
  { value: "mathematics", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "english", label: "English" },
  { value: "history", label: "History" },
  { value: "geography", label: "Geography" },
  { value: "art", label: "Art" },
  { value: "music", label: "Music" },
  { value: "physical_education", label: "Physical Education" },
  { value: "computer_science", label: "Computer Science" },
]

const DISABILITY_OPTIONS: { value: DisabilityType; label: string; description: string }[] = [
  { value: "none", label: "No Disability", description: "Standard learning experience" },
  { value: "visual_impairment", label: "Visual Impairment", description: "Blindness, low vision, color blindness" },
  { value: "hearing_impairment", label: "Hearing Impairment", description: "Deafness, hard of hearing" },
  { value: "motor_disability", label: "Motor Disability", description: "Limited mobility, fine motor challenges" },
  {
    value: "cognitive_disability",
    label: "Cognitive Disability",
    description: "Intellectual disabilities, learning challenges",
  },
  { value: "speech_disorder", label: "Speech Disorder", description: "Stuttering, apraxia, voice disorders" },
  { value: "autism_spectrum", label: "Autism Spectrum", description: "ASD, sensory processing differences" },
  { value: "dyslexia", label: "Dyslexia", description: "Reading and writing difficulties" },
  { value: "adhd", label: "ADHD", description: "Attention and focus challenges" },
  { value: "multiple", label: "Multiple Disabilities", description: "Combination of conditions" },
]

const LANGUAGE_OPTIONS: { value: Language; label: string; flag: string }[] = [
  { value: "english", label: "English", flag: "GB" },
  { value: "spanish", label: "Spanish", flag: "ES" },
  { value: "french", label: "French", flag: "FR" },
  { value: "german", label: "German", flag: "DE" },
  { value: "chinese", label: "Chinese", flag: "CN" },
  { value: "japanese", label: "Japanese", flag: "JP" },
  { value: "korean", label: "Korean", flag: "KR" },
  { value: "arabic", label: "Arabic", flag: "SA" },
  { value: "hindi", label: "Hindi", flag: "IN" },
  { value: "portuguese", label: "Portuguese", flag: "PT" },
  { value: "russian", label: "Russian", flag: "RU" },
  { value: "italian", label: "Italian", flag: "IT" },
]


function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { login } = useUser()
  const [isSignup, setIsSignup] = useState(searchParams.get("signup") === "true")
  const [role, setRole] = useState<"student" | "teacher">(
    (searchParams.get("role") as "student" | "teacher") || "student",
  )
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    grade: "",
    subjects: [] as Subject[],
    disabilityType: "none" as DisabilityType,
    grades: [] as string[],
    language: "english" as Language,
    religion: "prefer_not_to_say" as Religion,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsSignup(searchParams.get("signup") === "true")
    const roleParam = searchParams.get("role") as "student" | "teacher"
    if (roleParam) setRole(roleParam)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSignup && step === 1) {
      setStep(2)
      return
    }

    if (isSignup && step === 2) {
      setStep(3)
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const userId = Math.random().toString(36).substring(7)

    if (role === "student") {
      const studentProfile: StudentProfile = {
        id: userId,
        name: formData.name || "Student",
        email: formData.email,
        role: "student",
        age: Number.parseInt(formData.age) || 10,
        grade: formData.grade || "grade-5",
        subjects: formData.subjects.length > 0 ? formData.subjects : ["mathematics", "science", "english"],
        disabilityType: formData.disabilityType,
        language: formData.language,
        religion: formData.religion,
        accessibilityPreferences: {
          enableCaptions: formData.disabilityType === "hearing_impairment" || formData.disabilityType === "multiple",
          enableAudioMode:
            formData.disabilityType === "visual_impairment" ||
            formData.disabilityType === "dyslexia" ||
            formData.disabilityType === "multiple",
          enableSignLanguage:
            formData.disabilityType === "hearing_impairment" || formData.disabilityType === "multiple",
          enableBraille: formData.disabilityType === "visual_impairment" || formData.disabilityType === "multiple",
          textSize: formData.disabilityType === "visual_impairment" ? "large" : "medium",
          highContrast: formData.disabilityType === "visual_impairment",
          reducedMotion: formData.disabilityType === "autism_spectrum" || formData.disabilityType === "adhd",
          speechRate: formData.disabilityType === "cognitive_disability" ? 0.8 : 1,
        },
      }
      login(studentProfile)
      router.push("/dashboard/student")
    } else {
      const teacherProfile: TeacherProfile = {
        id: userId,
        name: formData.name || "Teacher",
        email: formData.email,
        role: "teacher",
        age: Number.parseInt(formData.age) || 30,
        subjects: formData.subjects.length > 0 ? formData.subjects : ["mathematics"],
        grades: formData.grades.length > 0 ? formData.grades : ["grade-5", "grade-6"],
        language: formData.language,
        religion: formData.religion,
      }
      login(teacherProfile)
      router.push("/dashboard/teacher")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubjectToggle = (subject: Subject) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }))
  }

  const handleGradeToggle = (grade: string) => {
    setFormData((prev) => ({
      ...prev,
      grades: prev.grades.includes(grade) ? prev.grades.filter((g) => g !== grade) : [...prev.grades, grade],
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full animate-float" />
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-secondary/20 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-20 h-20 bg-accent/10 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="relative">
            <BrainIcon className="w-10 h-10 text-primary group-hover:animate-wiggle transition-all" />
            <SparklesIcon className="w-5 h-5 text-secondary absolute -top-1 -right-1" />
          </div>
          <span className="font-bold text-2xl text-foreground">
            Trustable Tutor<span className="text-primary">+</span>
          </span>
        </Link>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setRole("student")
              setStep(1)
            }}
            className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
              role === "student"
                ? "border-primary bg-primary/10 shadow-lg"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  role === "student" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <GraduationIcon className="w-6 h-6" />
              </div>
              <span className={`font-semibold ${role === "student" ? "text-primary" : "text-muted-foreground"}`}>
                Student
              </span>
            </div>
          </button>

          <button
            onClick={() => {
              setRole("teacher")
              setStep(1)
            }}
            className={`flex-1 p-4 rounded-2xl border-2 transition-all ${
              role === "teacher"
                ? "border-secondary bg-secondary/10 shadow-lg"
                : "border-border bg-card hover:border-secondary/50"
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  role === "teacher" ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <BookIcon className="w-6 h-6" />
              </div>
              <span className={`font-semibold ${role === "teacher" ? "text-secondary" : "text-muted-foreground"}`}>
                Teacher
              </span>
            </div>
          </button>
        </div>

        <Card className="shadow-xl border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">
              {isSignup
                ? step === 1
                  ? "Create Account"
                  : step === 2
                    ? "Personal Details"
                    : "Preferences"
                : "Welcome Back!"}
            </CardTitle>
            <CardDescription>
              {isSignup
                ? step === 1
                  ? `Join as a ${role} and start your journey`
                  : step === 2
                    ? "Tell us more about yourself"
                    : "Language and accessibility settings"
                : `Sign in to your ${role} account`}
            </CardDescription>
            {isSignup && (
              <div className="flex justify-center gap-2 mt-4">
                <div className={`w-3 h-3 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
                <div className={`w-3 h-3 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
                <div className={`w-3 h-3 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`} />
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 1: Basic Info */}
              {(!isSignup || step === 1) && (
                <>
                  {isSignup && (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-12 text-base"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="********"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="h-12 text-base"
                    />
                  </div>
                  {isSignup && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="********"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="h-12 text-base"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Personal Details */}
              {isSignup && step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">Age</Label>
                      <Select value={formData.age} onValueChange={(v) => setFormData((p) => ({ ...p, age: v }))}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select age" />
                        </SelectTrigger>
                        <SelectContent>
                          {AGE_OPTIONS.map((age) => (
                            <SelectItem key={age} value={age.toString()}>
                              {age} years
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {role === "student" && (
                      <div className="space-y-2">
                        <Label className="text-foreground font-medium">Grade</Label>
                        <Select value={formData.grade} onValueChange={(v) => setFormData((p) => ({ ...p, grade: v }))}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADE_OPTIONS.map((grade) => (
                              <SelectItem key={grade.value} value={grade.value}>
                                {grade.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">
                      {role === "student" ? "Favorite Subjects" : "Teaching Subjects"}
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {SUBJECT_OPTIONS.map((subject) => (
                        <div
                          key={subject.value}
                          onClick={() => handleSubjectToggle(subject.value)}
                          className={`p-2 rounded-lg border-2 cursor-pointer text-center text-sm transition-all ${
                            formData.subjects.includes(subject.value)
                              ? role === "student"
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-secondary bg-secondary/10 text-secondary"
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          {subject.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {role === "teacher" && (
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">Grades You Teach</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {GRADE_OPTIONS.map((grade) => (
                          <div
                            key={grade.value}
                            onClick={() => handleGradeToggle(grade.value)}
                            className={`p-2 rounded-lg border-2 cursor-pointer text-center text-xs transition-all ${
                              formData.grades.includes(grade.value)
                                ? "border-secondary bg-secondary/10 text-secondary"
                                : "border-border hover:border-muted-foreground/50"
                            }`}
                          >
                            {grade.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Step 3: Language, Religion, and Disability */}
              {isSignup && step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Preferred Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(v) => setFormData((p) => ({ ...p, language: v as Language }))}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            <span className="flex items-center gap-2">
                              <span>{lang.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-medium">Religion (Optional)</Label>
                    <Select
                      value={formData.religion}
                      onValueChange={(v) => setFormData((p) => ({ ...p, religion: v as Religion }))}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select religion" />
                      </SelectTrigger>
                      <SelectContent>
                        {RELIGION_OPTIONS.map((rel) => (
                          <SelectItem key={rel.value} value={rel.value}>
                            {rel.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This helps us respect religious holidays and customize content appropriately.
                    </p>
                  </div>

                  {role === "student" && (
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium">Accessibility Needs (Optional)</Label>
                      <Select
                        value={formData.disabilityType}
                        onValueChange={(v) => setFormData((p) => ({ ...p, disabilityType: v as DisabilityType }))}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select if applicable" />
                        </SelectTrigger>
                        <SelectContent>
                          {DISABILITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span>{option.label}</span>
                                <span className="text-xs text-muted-foreground">{option.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        This helps us personalize your learning experience with the right accessibility features.
                      </p>
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-3">
                {isSignup && step > 1 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1 h-12">
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  className={`flex-1 h-12 text-base font-semibold ${role === "student" ? "" : "bg-secondary hover:bg-secondary/90"}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isSignup ? "Creating Account..." : "Signing In..."}
                    </span>
                  ) : isSignup ? (
                    step < 3 ? (
                      "Continue"
                    ) : (
                      "Create Account"
                    )
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignup(!isSignup)
                    setStep(1)
                  }}
                  className={`font-semibold hover:underline ${role === "student" ? "text-primary" : "text-secondary"}`}
                >
                  {isSignup ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
