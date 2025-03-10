import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CampaignBudget } from "@/components/calculators/influencer/campaign-budget"

export default function CampaignBudgetPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/calculators/influencer"
        className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Influencer Marketing Calculators
      </Link>
      <h1 className="text-3xl font-bold mb-6">Campaign Budget Calculator</h1>
      <p className="text-muted-foreground mb-8">
        Allocate your influencer marketing budget effectively across different tiers of influencers.
      </p>
      <CampaignBudget />
    </div>
  )
}

