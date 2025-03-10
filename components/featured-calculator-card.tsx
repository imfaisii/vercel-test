import { Youtube, TrendingUp } from "lucide-react"

interface ChannelCardProps {
  name: string
  description: string
  engagementRate: number
  quality: string
  views: string
  retention: string
  color: "red" | "blue" | "purple"
}

export function ChannelCard({ name, description, engagementRate, quality, views, retention, color }: ChannelCardProps) {
  const gradientColors = {
    red: "from-red-500 to-red-600",
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
  }

  const iconColor = {
    red: "text-red-500",
    blue: "text-blue-500",
    purple: "text-purple-500",
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      <div className={`bg-gradient-to-r ${gradientColors[color]} p-3`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Youtube className={`h-5 w-5 ${iconColor[color]}`} />
          </div>
          <div className="text-white">
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs opacity-80">{description}</div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <div className="text-sm font-medium mb-1">Engagement Rate</div>
        <div className="text-2xl font-bold text-primary">{engagementRate}%</div>
        <div className="text-xs text-muted-foreground">{quality}</div>

        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between text-xs">
            <span>Avg. Views</span>
            <span className="font-medium">{views}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Retention</span>
            <span className="font-medium">{retention}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FeaturedCalculatorSection() {
  return (
    <section className="mb-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl -z-10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 -mr-10 -mt-10 -z-10"></div>

      <div className="py-12 px-6 md:px-10 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary text-white p-2 rounded-lg">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Featured Calculator</h2>
            <p className="text-muted-foreground">Analyze your YouTube channel performance</p>
          </div>
        </div>

        {/* Rest of the component */}
      </div>
    </section>
  )
}

