import { ProgressDashboard } from "@/components/math-formula-game/progress-dashboard"

export default function ProgressPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Your Formula Mastery Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      <ProgressDashboard />
    </div>
  )
}

