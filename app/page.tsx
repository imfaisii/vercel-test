import Link from "next/link"
import type { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { categories } from "@/lib/calculator-data"
import { ArrowRight, TrendingUp, Youtube, Users, ThumbsUp, MessageSquare, Brain } from "lucide-react"

// Update the imports to include the Math Formula Widget
import { QuickCalculatorWidget } from "@/components/quick-calculator-widget"
import { TrendingCalculators } from "@/components/trending-calculators"
import { CalculatorChallenge } from "@/components/calculator-challenge"
import { CalculatorOfTheDay } from "@/components/calculator-of-the-day"
import { CalculatorFinder } from "@/components/calculator-finder"
import { RecentlyViewedCalculators } from "@/components/recently-viewed-calculators"
import { MathFormulaWidget } from "@/components/math-formula-game/math-formula-widget"

export const metadata: Metadata = {
  title: "Free Calculators Online | 50+ Tools for Math, Finance & More",
  description:
    "Access 100+ free calculators for math, finance, business, and more. No signup required. Start calculating instantly.",
  keywords: [
    "free calculators",
    "online calculator tools",
    "math calculators",
    "finance calculators",
    "business calculators",
    "free online calculators",
  ],
}

export default function Home() {
  const faqs = [
    {
      question: "Is FreeCalculators.ai really free to use?",
      answer: "Um, FreeCalculators.ai is completely free and always will be.",
    },
    {
      question: "Why .ai in FreeCalculators.ai?",
      answer:
        "Unless you've been sleeping under a pile of TRex bones, you've probably noticed that the world has undergone a significant transformation in recent years, especially with the rise of AI-powered search and intelligent agents. FreeCalculators.ai represents this shift, leveraging artificial intelligence to provide a suite of free calculators designed to make a real and powerful impact. My goal is to empower millions of people worldwide by enhancing their skills in areas like mathematics, financial planning, personal fitness, and business analytics. Through AI-driven assistance, I aim to simplify complex calculations and help users make smarter, data-driven decisions.",
    },
    {
      question: "Why Request a Free Calculator?",
      answer:
        "Ever heard of Elon Musk? Lazy. ;)  Me on the other hand? I love getting my hands dirty and tackling new challenges and building tools that truly benefit users. If you need a specific calculator, let me know—I'd love to take on the challenge and create it for you!",
    },
    {
      question: "What's the Join Waitlist about?",
      answer:
        "You'll be the first to know about what I'm cooking. Don't worry, I don't have time to spam you, sell you on a course or any of that hoodwinkery. Not sure if that's a word or not. It's like being first in line for a great concert or a game-changing product.  The end.",
    },
    {
      question: "Do I need to create an account to use the free calculators?",
      answer:
        "No, you don't need to create an account or sign up to use any of our free calculators. Simply visit the free calculator you need and start using it right away.",
    },
    {
      question: "Can I use these free calculators on my mobile device?",
      answer:
        "All of our free calculators are designed to be responsive and work well on mobile phones, tablets, and desktop computers.",
    },
  ]

  // Channel data with placeholder image URLs
  const channelData = [
    {
      name: "MrBeast",
      description: "200M+ subscribers",
      color: "from-red-500 to-red-600",
      engagementRate: "8.7%",
      quality: "Very High",
      views: "45.2M",
      retention: "68.3%",
      profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vuoi3OjYFYS76SKe7glWpsNyMwkHV7.png",
      thumbnailImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-705UE9Tl0FJWWUV4OE4vaJFvZ96gQ2.png",
    },
    {
      name: "Greg Isenberg",
      description: "Product & Design",
      color: "from-blue-500 to-blue-600",
      engagementRate: "5.2%",
      quality: "High",
      views: "12.8K",
      retention: "52.7%",
      profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-isl4RnIobxRLH8V8qyABxODhGvlTlX.png",
      thumbnailImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XqTlH1gjRZmeUqMGBP5QYZz4TLxIWN.png",
    },
    {
      name: "Crypto Banter",
      description: "Crypto News",
      color: "from-purple-500 to-purple-600",
      engagementRate: "4.3%",
      quality: "Good",
      views: "78.5K",
      retention: "41.2%",
      profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GnNWldVfLiMxLwc5qTXaEvLNzzAT31.png",
      thumbnailImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8cMnnHEwicoXNECHpyuN5ixLBSMPb1.png",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Free Online Calculators for Every Need</h1>
        <p className="text-lg text-muted-foreground">
          Find the perfect free calculator for any task - no signup required
        </p>
      </div>

      {/* Phase 1 Components - Add these right after the header */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickCalculatorWidget />
          <TrendingCalculators />
        </div>
      </section>

      <section aria-labelledby="calculator-categories" className="mb-16">
        <h2 id="calculator-categories" className="sr-only">
          Calculator Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  {category.icon}
                  <div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-sm font-medium mb-2">Popular {category.title} Calculators:</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {category.calculators.map((calculator, idx) => (
                    <li key={idx} className="mb-1">
                      <Link href={`/calculators/${category.slug}/${calculator.slug}`} className="hover:text-primary">
                        {calculator.name} Calculator
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={`/calculators/${category.slug}`} className="w-full">
                  <Button className="w-full h-auto py-2 whitespace-normal">
                    {category.title === "Influencer Marketing"
                      ? "View All Free Influencer Calculators"
                      : `View All Free ${category.title} Calculators`}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Calculator Section */}
      <section aria-labelledby="featured-calculator" className="mb-20 relative">
        <h2 id="featured-calculator" className="sr-only">
          Featured Calculator
        </h2>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl -z-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full opacity-30 -mr-10 -mt-10 -z-10"></div>

        <div className="py-12 px-6 md:px-10 rounded-xl border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary text-white p-2 rounded-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Featured Calculator</h2>
              <p className="text-muted-foreground">Free YouTube Engagement Rate Calculator</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">YouTube Engagement Rate Calculator</h3>
              <p className="mb-4">
                Discover how your YouTube channel performs compared to industry benchmarks. Analyze engagement metrics,
                retention rates, and subscriber growth with our comprehensive YouTube Engagement Rate Calculator.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-primary" />
                  <span>Paste any YouTube channel URL</span>
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Get subscriber and view analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-primary" />
                  <span>Analyze likes, comments, and shares</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Compare with industry benchmarks</span>
                </li>
              </ul>
              <Link href="/calculators/social-media/engagement-rate?platform=youtube">
                <Button size="lg" className="gap-2">
                  Try the Free Calculator <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {channelData.map((channel, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className={`bg-gradient-to-r ${channel.color} p-4 h-20 flex items-center`}>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {/* Use a fallback icon if image fails to load */}
                        <div className="relative w-full h-full">
                          <Image
                            src={channel.profileImage || "/placeholder.svg"}
                            alt={channel.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
                            <Youtube className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                      </div>
                      <div className="text-white">
                        <div className="text-sm font-medium">{channel.name}</div>
                        <div className="text-xs opacity-80">{channel.description}</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col min-h-[240px]">
                    <div className="mb-3 h-32 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
                      <Image
                        src={channel.thumbnailImage || "/placeholder.svg"}
                        alt={`${channel.name} video thumbnail`}
                        width={320}
                        height={180}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="text-sm font-medium mb-1">Engagement Rate</div>
                    <div className="text-2xl font-bold text-primary">{channel.engagementRate}</div>
                    <div className="text-xs text-muted-foreground">{channel.quality}</div>

                    <div className="mt-auto pt-4 border-t">
                      <div className="flex justify-between text-xs">
                        <span>Avg. Views</span>
                        <span className="font-medium">{channel.views}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Retention</span>
                        <span className="font-medium">{channel.retention}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-blue-100 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Want to analyze your YouTube channel?</div>
                <div className="text-sm text-muted-foreground">Get detailed engagement metrics in seconds</div>
              </div>
            </div>
            <Link href="/calculators/social-media/engagement-rate?platform=youtube">
              <Button>Analyze Your Channel</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Math Formula Game Widget */}
      <section className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MathFormulaWidget />
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                {/* Exactly match the heading size */}
                <h3 className="text-2xl font-bold">Math Formula Challenge</h3>
                <p className="text-muted-foreground">Test your knowledge daily</p>
              </div>
            </div>
            <p className="mb-4">Master essential math formulas through daily challenges and interactive practice.</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <span>Learn a new formula daily</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <span>Solve practice problems</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <span>Build your knowledge streak</span>
              </li>
            </ul>
            <Link href="/math-formulas">
              <Button className="w-full">Explore All Formulas</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Calculator Challenge Component */}
      <section className="mb-20">
        <CalculatorChallenge />
      </section>

      {/* Phase 2 Components - Updated to include Calculator Finder */}
      <section id="calculator-of-the-day-section" className="mb-20 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Swap the order to put Calculator Finder on the left */}
          <div className="order-2 lg:order-1">
            <CalculatorFinder />
          </div>
          <div className="order-1 lg:order-2">
            <CalculatorOfTheDay />
          </div>
        </div>
      </section>

      {/* Recently Viewed Calculators - Moved to its own section */}
      <section className="mb-20">
        <RecentlyViewedCalculators />
      </section>

      {/* FAQ Section */}
      <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-16">
        <div className="max-w-3xl mx-auto">
          <h2 id="faq-heading" className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions About Our Free Calculators
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  )
}

