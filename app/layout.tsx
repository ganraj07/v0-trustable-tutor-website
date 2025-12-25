import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { UserProvider } from "@/lib/user-context"

import { Fredoka, Comic_Neue, Oxanium as V0_Font_Oxanium, Source_Code_Pro as V0_Font_Source_Code_Pro, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _oxanium = V0_Font_Oxanium({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800"] })
const _sourceCodePro = V0_Font_Source_Code_Pro({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const fredoka = Fredoka({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] })
const comicNeue = Comic_Neue({ subsets: ["latin"], weight: ["300", "400", "700"] })

export const metadata: Metadata = {
  title: "Trustable Tutor+ | AI-Powered Inclusive Learning",
  description: "Personalized learning for every student with AI-powered accessibility features",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fredoka.className} font-sans antialiased`}>
        <UserProvider>{children}</UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
