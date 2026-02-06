"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BrainIcon, SparklesIcon } from "@/components/icons"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <BrainIcon className="w-8 h-8 text-primary group-hover:animate-wiggle transition-all" />
              <SparklesIcon className="w-4 h-4 text-secondary absolute -top-1 -right-1" />
            </div>
            <span className="font-bold text-xl text-foreground">
              Trustable Tutor<span className="text-primary">+</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Features
            </Link>
            <Link
              href="#student-features"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              For Students
            </Link>
            <Link
              href="#teacher-features"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              For Teachers
            </Link>
            <Link
              href="/ngo-directory"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              NGOs
            </Link>
            <Link
              href="/marketplace"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Marketplace
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="font-semibold bg-transparent">
                Login
              </Button>
            </Link>
            <Link href="/login?signup=true">
              <Button className="font-semibold bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12M6 12h16" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-primary transition-colors font-medium px-2 py-1"
              >
                Features
              </Link>
              <Link
                href="#student-features"
                className="text-muted-foreground hover:text-primary transition-colors font-medium px-2 py-1"
              >
                For Students
              </Link>
              <Link
                href="#teacher-features"
                className="text-muted-foreground hover:text-primary transition-colors font-medium px-2 py-1"
              >
                For Teachers
              </Link>
              <Link
                href="/ngo-directory"
                className="text-muted-foreground hover:text-primary transition-colors font-medium px-2 py-1"
              >
                NGOs
              </Link>
              <Link
                href="/marketplace"
                className="text-muted-foreground hover:text-primary transition-colors font-medium px-2 py-1"
              >
                Marketplace
              </Link>
              <Link
                href="#about"
                className="text-muted-foreground hover:text-primary transition-colors font-medium px-2 py-1"
              >
                About
              </Link>
              <div className="flex gap-3 pt-2">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full font-semibold bg-transparent">
                    Login
                  </Button>
                </Link>
                <Link href="/login?signup=true" className="flex-1">
                  <Button className="w-full font-semibold">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
