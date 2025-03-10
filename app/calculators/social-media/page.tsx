import Link from "next/link"
import { Share2 } from "lucide-react"
import { Suspense } from "react"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import EngagementRateCalculator from "@/components/calculators/social-media/engagement-rate"
import ReachEstimator from "@/components/calculators/social-media/reach-estimator"
import HashtagAnalytics from "@/components/calculators/social-media/hashtag-analytics"
import FollowerGrowthRate from "@/components/calculators/social-media/follower-growth-rate"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Free Social Media Calculators | Engagement, Reach & Growth Tools",
  description:
    "Optimize your social media strategy with our free calculators. Measure engagement rates, estimate reach, analyze hashtags, and project follower growth across platforms.",
  keywords: [
    "free social media calculators",
    "engagement rate calculator",
    "reach estimator",
    "hashtag analytics",
    "follower growth calculator",
    "social media metrics",
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

export default function SocialMediaCalculators() {
  const breadcrumbItems = [
    {
      label: "Calculators",
      href: "/",
    },
    {
      label: "Social Media Calculators",
      href: "/calculators/social-media",
      current: true,
    },
  ]

  const calculators = [
    {
      title: "Engagement Rate Calculator",
      description: "Calculate social media engagement rates",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <EngagementRateCalculator />
        </Suspense>
      ),
      href: "/calculators/social-media/engagement-rate",
    },
    {
      title: "Reach Estimator",
      description: "Estimate potential reach of social media posts",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <ReachEstimator />
        </Suspense>
      ),
      href: "/calculators/social-media/reach-estimator",
    },
    {
      title: "Hashtag Analytics",
      description: "Analyze hashtag performance and reach",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <HashtagAnalytics />
        </Suspense>
      ),
      href: "/calculators/social-media/hashtag-analytics",
    },
    {
      title: "Follower Growth Rate",
      description: "Calculate and project social media follower growth",
      component: (
        <Suspense fallback={<CalculatorLoading />}>
          <FollowerGrowthRate />
        </Suspense>
      ),
      href: "/calculators/social-media/follower-growth-rate",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Share2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Social Media Calculators</h1>
        </div>
        <p className="text-muted-foreground">Social media metrics and analytics calculators</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {calculators.map((calculator, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{calculator.title}</CardTitle>
              <CardDescription>{calculator.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {calculator.component ? (
                <div className="h-48 overflow-hidden">{calculator.component}</div>
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

