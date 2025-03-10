"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Share2, Copy, Download, LinkIcon, Check, Info, Plus, X } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toPng } from "html-to-image"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams, useRouter } from "next/navigation"

// Simulated hashtag data for analysis
const simulateHashtagData = (hashtag: string) => {
  // Generate a deterministic but seemingly random value based on the hashtag
  const hashValue = hashtag.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Scale factors to make the numbers look realistic
  const popularityFactor = (hashValue % 100) / 100
  const competitionFactor = (hashValue % 80) / 100
  const trendingFactor = ((hashValue * 7) % 100) / 100

  // Calculate metrics
  const postsCount = Math.floor(1000 + popularityFactor * 9000000)
  const reachPotential = Math.floor(postsCount * (0.5 + popularityFactor))
  const avgLikes = Math.floor(10 + popularityFactor * 990)
  const avgComments = Math.floor(1 + popularityFactor * 99)
  const growthRate = Math.floor(-5 + trendingFactor * 30)
  const competitionLevel = 10 + Math.floor(competitionFactor * 90)

  // Generate related hashtags
  const relatedHashtags = [
    `#${hashtag}life`,
    `#${hashtag}love`,
    `#${hashtag}daily`,
    `#${hashtag}gram`,
    `#${hashtag}photo`,
    `#best${hashtag}`,
    `#${hashtag}world`,
    `#${hashtag}official`,
  ].slice(0, 5 + (hashValue % 3))

  // Determine difficulty level
  let difficultyLevel
  if (competitionLevel < 30) difficultyLevel = "Easy"
  else if (competitionLevel < 60) difficultyLevel = "Moderate"
  else if (competitionLevel < 85) difficultyLevel = "Hard"
  else difficultyLevel = "Very Hard"

  // Determine trending status
  let trendingStatus
  if (growthRate < 0) trendingStatus = "Declining"
  else if (growthRate < 5) trendingStatus = "Stable"
  else if (growthRate < 15) trendingStatus = "Growing"
  else trendingStatus = "Trending"

  return {
    hashtag: `#${hashtag}`,
    postsCount,
    reachPotential,
    avgLikes,
    avgComments,
    growthRate,
    competitionLevel,
    difficultyLevel,
    trendingStatus,
    relatedHashtags,
    // Add time-based data for charts
    weeklyData: Array(7)
      .fill(0)
      .map((_, i) => ({
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
        posts: Math.floor((postsCount / 365) * (0.8 + Math.sin(i) * 0.3 + Math.random() * 0.2)),
      })),
    metrics: [
      { subject: "Popularity", A: Math.floor(popularityFactor * 100), fullMark: 100 },
      { subject: "Growth", A: Math.floor(trendingFactor * 100), fullMark: 100 },
      {
        subject: "Engagement",
        A: Math.floor(((avgLikes + avgComments * 5) / (10 + popularityFactor * 990)) * 100),
        fullMark: 100,
      },
      { subject: "Reach", A: Math.floor((reachPotential / postsCount) * 100), fullMark: 100 },
      { subject: "Competition", A: 100 - competitionLevel, fullMark: 100 },
    ],
  }
}

export default function HashtagAnalyticsCalculator() {
  const [platform, setPlatform] = useState("instagram")
  const [hashtag, setHashtag] = useState("")
  const [hashtagList, setHashtagList] = useState<string[]>([])
  const [hashtagData, setHashtagData] = useState<any>(null)
  const [comparisonData, setComparisonData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("calculator")

  const resultsRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Load data from URL if available
  useEffect(() => {
    if (searchParams.has("platform")) {
      const platformParam = searchParams.get("platform") || "instagram"
      setPlatform(platformParam)
    }

    if (searchParams.has("hashtag")) {
      const hashtagParam = searchParams.get("hashtag") || ""
      if (hashtagParam) {
        setHashtag(hashtagParam)
        analyzeHashtag(hashtagParam)
      }
    }
  }, [searchParams])

  const addHashtag = () => {
    if (!hashtag) {
      toast({
        title: "Error",
        description: "Please enter a hashtag",
        variant: "destructive",
      })
      return
    }

    // Remove # if user included it
    const cleanHashtag = hashtag.replace(/^#/, "")

    if (cleanHashtag.length < 2) {
      toast({
        title: "Error",
        description: "Hashtag must be at least 2 characters",
        variant: "destructive",
      })
      return
    }

    if (hashtagList.includes(cleanHashtag)) {
      toast({
        title: "Error",
        description: "This hashtag is already in your list",
        variant: "destructive",
      })
      return
    }

    // Add to list
    setHashtagList([...hashtagList, cleanHashtag])
    setHashtag("")
  }

  const removeHashtag = (tag: string) => {
    setHashtagList(hashtagList.filter((h) => h !== tag))
  }

  const analyzeHashtag = (tag?: string) => {
    const tagToAnalyze = tag || (hashtagList.length > 0 ? hashtagList[0] : null)

    if (!tagToAnalyze) {
      toast({
        title: "Error",
        description: "Please add at least one hashtag to analyze",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      try {
        // Get data for the main hashtag
        const mainData = simulateHashtagData(tagToAnalyze)
        setHashtagData(mainData)

        // Get data for comparison if we have multiple hashtags
        if (hashtagList.length > 1 || (hashtagList.length === 1 && tag && tag !== hashtagList[0])) {
          const comparisonTags = tag ? [...hashtagList.filter((h) => h !== tag), tag] : hashtagList

          const compData = comparisonTags.map((h) => {
            const data = simulateHashtagData(h)
            return {
              hashtag: data.hashtag,
              postsCount: data.postsCount,
              reachPotential: data.reachPotential,
              competitionLevel: data.competitionLevel,
              growthRate: data.growthRate,
              difficultyLevel: data.difficultyLevel,
            }
          })

          setComparisonData(compData)
        } else {
          setComparisonData([])
        }

        // Switch to results tab
        setActiveTab("results")

        toast({
          title: "Analysis complete",
          description: `Successfully analyzed #${tagToAnalyze}`,
        })
      } catch (error) {
        console.error("Error analyzing hashtag:", error)
        toast({
          title: "Error",
          description: "Failed to analyze hashtag. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }, 1500)
  }

  // Format large numbers
  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value}%`
  }

  // Prepare data for bar chart
  const getBarChartData = () => {
    if (!hashtagData) return []

    return [
      { name: "Posts", value: hashtagData.postsCount },
      { name: "Reach", value: hashtagData.reachPotential },
      { name: "Avg Likes", value: hashtagData.avgLikes * 1000 }, // Scale up for visibility
      { name: "Avg Comments", value: hashtagData.avgComments * 1000 }, // Scale up for visibility
    ]
  }

  // Prepare data for competition pie chart
  const getCompetitionData = () => {
    if (!hashtagData) return []

    return [
      { name: "Competition", value: hashtagData.competitionLevel },
      { name: "Opportunity", value: 100 - hashtagData.competitionLevel },
    ]
  }

  // Colors for charts
  const COLORS = ["#3b82f6", "#93c5fd"]
  const RADAR_COLOR = "#3b82f6"

  // Copy results to clipboard
  const copyToClipboard = () => {
    if (!hashtagData) return

    const text = `
Hashtag Analytics Results:
Platform: ${platform.charAt(0).toUpperCase() + platform.slice(1)}
Hashtag: ${hashtagData.hashtag}

Posts: ${formatNumber(hashtagData.postsCount)}
Reach Potential: ${formatNumber(hashtagData.reachPotential)}
Average Likes: ${formatNumber(hashtagData.avgLikes)}
Average Comments: ${formatNumber(hashtagData.avgComments)}
Growth Rate: ${formatPercentage(hashtagData.growthRate)}
Competition Level: ${hashtagData.competitionLevel}%
Difficulty Level: ${hashtagData.difficultyLevel}
Trending Status: ${hashtagData.trendingStatus}

Related Hashtags:
${hashtagData.relatedHashtags.join(", ")}
`

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Copied to clipboard",
        description: "The analysis results have been copied to your clipboard.",
      })
    })
  }

  // Share via URL
  const shareViaURL = () => {
    if (!hashtagData) return

    const baseUrl = window.location.origin + window.location.pathname
    const params = new URLSearchParams()

    params.set("platform", platform)
    params.set("hashtag", hashtagData.hashtag.replace("#", ""))

    const shareUrl = `${baseUrl}?${params.toString()}`

    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Share link copied",
        description: "A link to these results has been copied to your clipboard.",
      })
    })
  }

  // Download as image
  const downloadAsImage = () => {
    if (resultsRef.current) {
      toPng(resultsRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a")
          link.download = `hashtag-analysis-${hashtagData?.hashtag.replace("#", "")}.png`
          link.href = dataUrl
          link.click()

          toast({
            title: "Image downloaded",
            description: "The analysis results have been downloaded as an image.",
          })
        })
        .catch((error) => {
          console.error("Error generating image:", error)
          toast({
            title: "Error",
            description: "There was an error generating the image.",
            variant: "destructive",
          })
        })
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Hashtag Analyzer</TabsTrigger>
          <TabsTrigger value="results">Results & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Hashtag Analysis</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="platform">Social Media Platform</Label>
                  <Select value={platform} onValueChange={(value) => setPlatform(value)}>
                    <SelectTrigger id="platform" className="mt-1">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="hashtag">Enter Hashtag</Label>
                  <div className="flex mt-1">
                    <Input
                      id="hashtag"
                      type="text"
                      value={hashtag}
                      onChange={(e) => setHashtag(e.target.value)}
                      placeholder="Enter hashtag without #"
                      className="rounded-r-none"
                    />
                    <Button onClick={addHashtag} className="rounded-l-none">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add multiple hashtags to compare their performance
                  </p>
                </div>

                {hashtagList.length > 0 && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <Label className="mb-2 block">Your Hashtags</Label>
                    <div className="flex flex-wrap gap-2">
                      {hashtagList.map((tag) => (
                        <div key={tag} className="bg-white px-3 py-1 rounded-full border flex items-center gap-1">
                          <span>#{tag}</span>
                          <button
                            onClick={() => removeHashtag(tag)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => analyzeHashtag()}
                  className="w-full"
                  disabled={isLoading || hashtagList.length === 0}
                >
                  {isLoading ? "Analyzing..." : "Analyze Hashtags"}
                </Button>
              </div>

              <div className="mt-8">
                <h3 className="font-medium mb-2">Popular Hashtags by Category</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Travel</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>#travel</div>
                      <div>#wanderlust</div>
                      <div>#travelgram</div>
                      <div>#adventure</div>
                      <div>#explore</div>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Food</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>#foodie</div>
                      <div>#foodporn</div>
                      <div>#instafood</div>
                      <div>#delicious</div>
                      <div>#yummy</div>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Fitness</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>#fitness</div>
                      <div>#workout</div>
                      <div>#gym</div>
                      <div>#fitnessmotivation</div>
                      <div>#health</div>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Business</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>#business</div>
                      <div>#entrepreneur</div>
                      <div>#marketing</div>
                      <div>#success</div>
                      <div>#motivation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">About Hashtag Analytics</h2>

              <div className="space-y-4 text-sm">
                <p>
                  <strong>Hashtag analytics</strong> helps you understand the performance, reach, and competition level
                  of hashtags on social media platforms. This information is crucial for optimizing your content
                  strategy and increasing visibility.
                </p>

                <div className="bg-white p-4 rounded-md">
                  <h3 className="font-medium mb-2">Key metrics analyzed:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Post volume and frequency</li>
                    <li>Reach potential</li>
                    <li>Engagement rates</li>
                    <li>Competition level</li>
                    <li>Growth trends</li>
                    <li>Related hashtags</li>
                  </ul>
                </div>

                <p>
                  <strong>Effective hashtag strategy</strong> can significantly increase your content's visibility and
                  help you reach your target audience. By analyzing hashtag performance, you can make data-driven
                  decisions about which tags to use.
                </p>

                <h3 className="font-medium mt-4">Why hashtag analysis matters:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Increases content discoverability</li>
                  <li>Helps reach targeted audiences</li>
                  <li>Improves engagement rates</li>
                  <li>Identifies trending topics</li>
                  <li>Optimizes content strategy</li>
                </ul>

                <div className="bg-blue-50 p-3 rounded-md mt-4">
                  <p className="text-xs">
                    <strong>Pro Tip:</strong> Use a mix of high-volume and niche hashtags for the best results.
                    High-volume hashtags provide broader reach, while niche hashtags target specific audiences with less
                    competition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results">
          <div className="mt-6" ref={resultsRef}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Hashtag Analysis Results</h2>

              {hashtagData && (
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-3" align="end">
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={copyToClipboard}
                          >
                            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                            Copy results
                          </Button>
                          <Button variant="outline" size="sm" className="w-full justify-start" onClick={shareViaURL}>
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Share link
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start"
                            onClick={downloadAsImage}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download image
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TooltipProvider>
                </div>
              )}
            </div>

            {hashtagData ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="overflow-hidden">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Hashtag</div>
                      <div className="text-3xl font-bold text-primary flex items-center">
                        {hashtagData.hashtag}
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Analysis for {hashtagData.hashtag} on {platform}
                              </p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </div>
                      <div className="mt-2 text-sm">
                        Posts: <span className="font-medium">{formatNumber(hashtagData.postsCount)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Difficulty Level</div>
                      <div className="text-2xl font-bold">{hashtagData.difficultyLevel}</div>
                      <div className="mt-2 text-sm">
                        Competition: <span className="font-medium">{hashtagData.competitionLevel}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Hashtag Performance</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getBarChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatNumber(Number(value)), "Count"]} />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">Competition Analysis</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getCompetitionData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                          >
                            {getCompetitionData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">Hashtag Metrics</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={hashtagData.metrics}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name="Metrics" dataKey="A" stroke={RADAR_COLOR} fill={RADAR_COLOR} fillOpacity={0.6} />
                          <Tooltip formatter={(value) => [`${value}/100`, "Score"]} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Reach Potential</div>
                      <div className="text-2xl font-bold">{formatNumber(hashtagData.reachPotential)}</div>
                      <div className="text-xs text-muted-foreground mt-1">Estimated audience reach</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Growth Rate</div>
                      <div className="text-2xl font-bold">{formatPercentage(hashtagData.growthRate)}</div>
                      <div className="text-xs text-muted-foreground mt-1">{hashtagData.trendingStatus}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Engagement</div>
                      <div className="text-2xl font-bold">{formatNumber(hashtagData.avgLikes)} likes</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatNumber(hashtagData.avgComments)} comments per post
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Related Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {hashtagData.relatedHashtags.map((tag: string) => (
                      <div key={tag} className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>

                {comparisonData.length > 0 && (
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">Hashtag Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Hashtag
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Posts
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Reach
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Competition
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Growth
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Difficulty
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {comparisonData.map((data, index) => (
                            <tr key={index} className={data.hashtag === hashtagData.hashtag ? "bg-blue-50" : ""}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{data.hashtag}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatNumber(data.postsCount)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatNumber(data.reachPotential)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {data.competitionLevel}%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatPercentage(data.growthRate)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {data.difficultyLevel}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-medium mb-3">Hashtag Strategy Recommendations</h3>
                  <div className="space-y-3">
                    <p className="text-sm">
                      Based on the analysis of <strong>{hashtagData.hashtag}</strong>, here are some recommendations:
                    </p>
                    <ul className="list-disc pl-5 text-sm space-y-2">
                      <li>
                        <strong>Competition Level:</strong>{" "}
                        {hashtagData.competitionLevel > 70
                          ? "This hashtag has high competition. Consider pairing it with more niche hashtags for better visibility."
                          : "This hashtag has moderate to low competition, making it a good choice for visibility."}
                      </li>
                      <li>
                        <strong>Growth Trend:</strong>{" "}
                        {hashtagData.growthRate > 0
                          ? `This hashtag is ${hashtagData.growthRate > 10 ? "trending upward" : "stable"} with a ${formatPercentage(hashtagData.growthRate)} growth rate.`
                          : "This hashtag is declining in usage. Consider using more trending alternatives."}
                      </li>
                      <li>
                        <strong>Optimal Usage:</strong>{" "}
                        {hashtagData.postsCount > 1000000
                          ? "This is a high-volume hashtag. Use it for broad reach, but don't rely on it alone."
                          : "This is a more targeted hashtag that can help you reach a specific audience."}
                      </li>
                      <li>
                        <strong>Hashtag Mix:</strong> Combine this {hashtagData.difficultyLevel.toLowerCase()}{" "}
                        difficulty hashtag with{" "}
                        {hashtagData.difficultyLevel === "Easy"
                          ? "some more competitive tags"
                          : hashtagData.difficultyLevel === "Very Hard"
                            ? "several easier, niche tags"
                            : "a mix of both easier and more competitive tags"}{" "}
                        for optimal reach.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">No results to display yet</div>
                <Button onClick={() => setActiveTab("calculator")}>Go to Analyzer</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

