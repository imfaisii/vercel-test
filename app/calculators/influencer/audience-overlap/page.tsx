import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AudienceOverlap } from "@/components/calculators/influencer/audience-overlap"

export default function AudienceOverlapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/calculators/influencer"
        className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Influencer Marketing Calculators
      </Link>
      <h1 className="text-3xl font-bold mb-6">Audience Overlap Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Estimate unique reach when using multiple influencers for your marketing campaigns.
      </p>
      <AudienceOverlap />
    </div>
  )
}

