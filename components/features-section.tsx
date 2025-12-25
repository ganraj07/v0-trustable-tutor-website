import { Card, CardContent } from "@/components/ui/card"
import {
  CaptionsIcon,
  AudioIcon,
  HandIcon,
  BrailleIcon,
  NotesIcon,
  ChartIcon,
  DrawIcon,
  DashboardIcon,
  RequestIcon,
  UploadIcon,
  EngagementIcon,
} from "@/components/icons"

const studentFeatures = [
  {
    icon: CaptionsIcon,
    title: "Real-time AI Captions",
    description: "Automatically converts speech to text during live classes with accurate, instant subtitles.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: AudioIcon,
    title: "Personalized Audio Learning",
    description: "Customized audio formats based on your pace, preferences, and learning style.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: HandIcon,
    title: "Sign Language Recognition",
    description: "AI detects hand signs and gestures for seamless interaction and support.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: BrailleIcon,
    title: "Braille & Tactile Support",
    description: "Integrates with Braille displays and tactile devices for visually impaired students.",
    color: "bg-chart-5/20 text-chart-5",
  },
  {
    icon: NotesIcon,
    title: "Smart AI Notes",
    description: "Automatically summarizes class discussions into clean, structured notes.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: ChartIcon,
    title: "Performance Analytics",
    description: "Tracks learning patterns to provide personalized improvement plans.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: DrawIcon,
    title: "AI Air Drawing",
    description: "Draw in mid-air using hand tracking and convert gestures to digital art.",
    color: "bg-accent/10 text-accent",
  },
]

const teacherFeatures = [
  {
    icon: DashboardIcon,
    title: "Live Class Dashboard",
    description: "Real-time attendance, engagement, and participation metrics during live sessions.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: RequestIcon,
    title: "Request Management",
    description: "Handle doubts, permissions, and support queries efficiently within the platform.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: UploadIcon,
    title: "Content Upload & Sharing",
    description: "Easily upload, organize, and distribute study materials and resources.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: EngagementIcon,
    title: "Engagement Analytics",
    description: "Detailed insights on student activity and learning outcomes.",
    color: "bg-chart-5/20 text-chart-5",
  },
]

export function FeaturesSection() {
  return (
    <>
      {/* Student Features */}
      <section id="student-features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 font-medium">
              <span className="text-xl">🎓</span>
              For Students
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              Learning Tools That <span className="text-primary">Adapt</span> to You
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every student learns differently. Our AI understands your unique needs and creates the perfect learning
              experience just for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {studentFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-2 border-transparent hover:border-primary/20"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-lg text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Features */}
      <section id="teacher-features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full mb-4 font-medium">
              <span className="text-xl">👩‍🏫</span>
              For Teachers
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              Empower Your <span className="text-secondary">Teaching</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to manage your classroom, track student progress, and create engaging learning experiences.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teacherFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card border-2 border-transparent hover:border-secondary/20"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-lg text-card-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
