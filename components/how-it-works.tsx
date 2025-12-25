import { BrainIcon, SparklesIcon } from "@/components/icons"

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Sign up and tell us about your learning preferences, abilities, and goals.",
    emoji: "📝",
  },
  {
    number: "02",
    title: "AI Learns About You",
    description: "Our AI analyzes your learning style and creates a personalized curriculum.",
    emoji: "🤖",
  },
  {
    number: "03",
    title: "Start Learning",
    description: "Access adaptive content delivered in your preferred format - text, audio, visual, or tactile.",
    emoji: "🚀",
  },
  {
    number: "04",
    title: "Track Progress",
    description: "Watch your skills grow with detailed analytics and personalized improvement plans.",
    emoji: "📈",
  },
]

export function HowItWorks() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-4 font-medium">
            <BrainIcon className="w-5 h-5" />
            How It Works
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Learning in <span className="text-accent">4 Simple</span> Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started with Trustable Tutor+ is easy and fun!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-1 bg-gradient-to-r from-primary/30 to-secondary/30 z-0" />
              )}

              <div className="relative bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-border hover:border-primary/20">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{step.emoji}</span>
                  <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    Step {step.number}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-card-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Personalization highlight */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-primary mb-4">
                <SparklesIcon className="w-6 h-6" />
                <span className="font-semibold">AI-Powered Personalization</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-balance">
                Content Adapts to Your Unique Needs
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="font-semibold text-foreground">Multiple Formats</p>
                    <p className="text-muted-foreground text-sm">Text, audio, visual, or tactile - learn your way</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-semibold text-foreground">Adaptive Pacing</p>
                    <p className="text-muted-foreground text-sm">Lessons adjust to your learning speed</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-semibold text-foreground">Smart Difficulty</p>
                    <p className="text-muted-foreground text-sm">Questions match your skill level</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="/ai-brain-with-connected-learning-elements--childre.jpg"
                alt="AI personalization illustration"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
