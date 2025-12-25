import Link from "next/link"
import { BrainIcon, SparklesIcon, HeartIcon } from "@/components/icons"

export function Footer() {
  return (
    <footer id="about" className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <BrainIcon className="w-8 h-8 text-primary" />
                <SparklesIcon className="w-4 h-4 text-secondary absolute -top-1 -right-1" />
              </div>
              <span className="font-bold text-xl text-card-foreground">
                Trustable Tutor<span className="text-primary">+</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              An AI-powered platform that creates a personalized learning environment for every student. Making
              education adaptive, inclusive, and efficient.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Made with</span>
              <HeartIcon className="w-5 h-5 text-destructive" />
              <span>for inclusive learning</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-card-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#student-features" className="text-muted-foreground hover:text-primary transition-colors">
                  For Students
                </Link>
              </li>
              <li>
                <Link href="#teacher-features" className="text-muted-foreground hover:text-primary transition-colors">
                  For Teachers
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Accessibility */}
          <div>
            <h4 className="font-bold text-card-foreground mb-4">Accessibility</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-lg">📝</span> Real-time Captions
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-lg">🤟</span> Sign Language Support
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-lg">⠿</span> Braille Integration
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <span className="text-lg">🔊</span> Audio Learning
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Trustable Tutor+. All rights reserved. Making learning accessible for
            everyone.
          </p>
        </div>
      </div>
    </footer>
  )
}
