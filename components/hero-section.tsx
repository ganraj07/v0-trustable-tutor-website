import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SparklesIcon, HeartIcon, StarIcon } from "@/components/icons"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" />
        <div
          className="absolute top-40 right-20 w-16 h-16 bg-secondary/30 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-accent/20 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-40 right-1/3 w-24 h-24 bg-primary/10 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 font-medium">
              <SparklesIcon className="w-5 h-5" />
              AI-Powered Inclusive Learning
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
              Learning Made <span className="text-primary">Magical</span> for{" "}
              <span className="text-secondary">Every</span> Student
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Trustable Tutor+ uses artificial intelligence to create a personalized learning environment that adapts to
              every student's unique needs, abilities, and learning style.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/login?role=student&signup=true">
                <Button
                  size="lg"
                  className="font-bold text-lg px-8 py-6 bg-primary hover:bg-primary/90 w-full sm:w-auto"
                >
                  <StarIcon className="w-5 h-5 mr-2" />
                  I'm a Student
                </Button>
              </Link>
              <Link href="/login?role=teacher&signup=true">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-bold text-lg px-8 py-6 border-2 w-full sm:w-auto bg-transparent"
                >
                  <HeartIcon className="w-5 h-5 mr-2" />
                  I'm a Teacher
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 mt-10">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">50K+</p>
                <p className="text-sm text-muted-foreground">Happy Students</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">2K+</p>
                <p className="text-sm text-muted-foreground">Amazing Teachers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">98%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl p-8 lg:p-12">
              <img
                src="/diverse-happy-children-learning-together-with-ai-t.jpg"
                alt="Happy students learning together with AI assistance"
                className="w-full h-auto rounded-2xl shadow-xl"
              />

              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-card px-4 py-2 rounded-xl shadow-lg animate-bounce-soft">
                <span className="text-2xl">🎯</span>
                <span className="ml-2 font-semibold text-sm">Personalized</span>
              </div>

              <div
                className="absolute -bottom-4 -right-4 bg-card px-4 py-2 rounded-xl shadow-lg animate-bounce-soft"
                style={{ animationDelay: "0.5s" }}
              >
                <span className="text-2xl">♿</span>
                <span className="ml-2 font-semibold text-sm">Accessible</span>
              </div>

              <div
                className="absolute top-1/2 -right-6 bg-card px-4 py-2 rounded-xl shadow-lg animate-bounce-soft"
                style={{ animationDelay: "1s" }}
              >
                <span className="text-2xl">🤖</span>
                <span className="ml-2 font-semibold text-sm">AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
