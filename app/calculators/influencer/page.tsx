import Link from "next/link"
import { TrendingUp } from "lucide-react"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Free Influencer Marketing Calculators | ROI, Audience & Budget Tools",
  description:
    "Plan effective influencer campaigns with our free calculators. Calculate ROI, estimate audience overlap, allocate budgets, and track conversion metrics for influencer marketing.",
  keywords: [
    "free influencer marketing calculators",
    "influencer ROI calculator",
    "audience overlap calculator",
    "campaign budget calculator",
    "conversion rate calculator",
    "influencer metrics",
  ],
}

// Create a loading component for the Suspense fallback
function CalculatorLoading() {
  return (
    <div className="h-48 flex items-center justify-center bg-muted/40 rounded-md">
      <p className="text-muted-foreground">Loading calculator...</p>
    </div>
  )
}

// Create a preview component for the Influencer ROI calculator
function InfluencerROIPreview() {
  return (
    <div className="h-48 overflow-hidden">
      <Tabs defaultValue="calculator">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="results">Results & Visualizations</TabsTrigger>
        </TabsList>
        <TabsContent value="calculator" className="p-2">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Campaign Details</h3>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Social Media Platform</p>
              <div className="border rounded p-1 text-xs">Instagram</div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Create a preview component for the Audience Overlap calculator
function AudienceOverlapPreview() {
  return (
    <div className="h-48 overflow-hidden">
      <Tabs defaultValue="calculator">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="calculator" className="p-2">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Influencer Details</h3>
              <Button variant="outline" size="sm" className="text-xs">
                Add Influencer
              </Button>
            </div>
            <div className="rounded-lg bg-muted p-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1 p-2 bg-background rounded-md">
                  <span className="text-xs text-muted-foreground">Total Audience</span>
                  <p className="text-sm font-medium">230,000</p>
                </div>
                <div className="space-y-1 p-2 bg-background rounded-md">
                  <span className="text-xs text-muted-foreground">Unique</span>
                  <p className="text-sm font-medium">184,000</p>
                </div>
                <div className="space-y-1 p-2 bg-background rounded-md">
                  <span className="text-xs text-muted-foreground">Efficiency</span>
                  <p className="text-sm font-medium">80.0%</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Create a preview component for the Campaign Budget calculator
function CampaignBudgetPreview() {
  return (
    <div className="h-48 overflow-hidden">
      <Tabs defaultValue="calculator">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="calculator" className="p-2">
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Budget</p>
              <div className="border rounded p-1 text-xs">$50,000</div>
            </div>
            <div className="rounded-lg bg-muted p-2">
              <h4 className="text-xs font-medium mb-1">Budget Allocation</h4>
              <div className="grid grid-cols-3 gap-1">
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground">Micro</span>
                  <p className="text-xs font-medium">$20,000</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground">Macro</span>
                  <p className="text-xs font-medium">$15,000</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs text-muted-foreground">Mega</span>
                  <p className="text-xs font-medium">$15,000</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Create a preview component for the Conversion Rate calculator
function ConversionRatePreview() {
  return (
    <div className="h-48 overflow-hidden">
      <Tabs defaultValue="calculator">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="calculator" className="p-2">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Campaign Funnel Metrics</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">CTR:</span>
                  <span className="text-xs font-medium">5.00%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Visit Rate:</span>
                  <span className="text-xs font-medium">80.00%</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">ROAS:</span>
                  <span className="text-xs font-medium text-green-500">1.50x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Revenue:</span>
                  <span className="text-xs font-medium">$15,000</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function InfluencerCalculators() {
  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: "Influencer Marketing Calculators",
      href: "/calculators/influencer",
      current: true,
    },
  ]

  const calculators = [
    {
      title: "Influencer ROI",
      description: "Calculate the return on investment for influencer campaigns",
      component: <InfluencerROIPreview />,
      href: "/calculators/influencer/influencer-roi",
    },
    {
      title: "Audience Overlap",
      description: "Estimate unique reach when using multiple influencers",
      component: <AudienceOverlapPreview />,
      href: "/calculators/influencer/audience-overlap",
    },
    {
      title: "Campaign Budget",
      description: "Allocate your influencer marketing budget effectively",
      component: <CampaignBudgetPreview />,
      href: "/calculators/influencer/campaign-budget",
    },
    {
      title: "Conversion Rate",
      description: "Track conversion metrics throughout the marketing funnel",
      component: <ConversionRatePreview />,
      href: "/calculators/influencer/conversion-rate",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Influencer Marketing Calculators</h1>
        </div>
        <p className="text-muted-foreground">Tools for influencer campaign planning and analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {calculators.map((calculator, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{calculator.title} Calculator</CardTitle>
              <CardDescription>{calculator.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {calculator.component ? (
                calculator.component
              ) : (
                <div className="h-48 flex items-center justify-center bg-muted/40 rounded-md">
                  <p className="text-muted-foreground">Calculator preview not available</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href={calculator.href} className="w-full">
                <Button variant="outline" className="w-full">
                  View Free Calculator
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

