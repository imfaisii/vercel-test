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
  LineChart,
  Line,
} from "recharts"
import { Share2, Copy, Download, LinkIcon, Check, Info } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toPng } from "html-to-image"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams, useRouter } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function ReachEstimatorCalculator() {
  const [followers, setFollowers] = useState(10000)
  const [engagementRate, setEngagementRate] = useState(3.5)
  const [postFrequency, setPostFrequency] = useState(5)
  const [hashtagReach, setHashtagReach] = useState(30)
  const [platform, setPlatform] = useState("instagram")
  const [contentType, setContentType] = useState("image")
  const [accountAge, setAccountAge] = useState(12)
  const [useSliders, setUseSliders] = useState(true)

  const [reachEstimate, setReachEstimate] = useState({
    organicReach: 0,
    viralReach: 0,
    totalReach: 0,
    impressions: 0,
    weeklyReach: 0,
    monthlyReach: 0,
  })

  const [reachQuality, setReachQuality] = useState("")
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
  }, [searchParams])

  useEffect(() => {
    if (searchParams.has("platform")) {
      const platformParam = searchParams.get("platform") || "instagram"
      const followersParam = Number.parseInt(searchParams.get("followers") || "10000")
      const engagementRateParam = Number.parseFloat(searchParams.get("engagementRate") || "3.5")
      const postFrequencyParam = Number.parseInt(searchParams.get("postFrequency") || "5")
      const hashtagReachParam = Number.parseInt(searchParams.get("hashtagReach") || "30")
      const contentTypeParam = searchParams.get("contentType") || "image"
      const accountAgeParam = Number.parseInt(searchParams.get("accountAge") || "12")

      setPlatform(platformParam)
      setFollowers(followersParam)
      setEngagementRate(engagementRateParam)
      setPostFrequency(postFrequencyParam)
      setHashtagReach(hashtagReachParam)
      setContentType(contentTypeParam)
      setAccountAge(accountAgeParam)

      // Calculate reach with loaded data
      calculateReach({
        platform: platformParam,
        followers: followersParam,
        engagementRate: engagementRateParam,
        postFrequency: postFrequencyParam,
        hashtagReach: hashtagReachParam,
        contentType: contentTypeParam,
        accountAge: accountAgeParam,
      })

      // Switch to results tab
      setActiveTab("results")
    }
  }, [searchParams])

  const calculateReach = (data?: {
    platform: string
    followers: number
    engagementRate: number
    postFrequency: number
    hashtagReach: number
    contentType: string
    accountAge: number
  }) => {
    // Use provided data or current state
    const calcPlatform = data?.platform || platform
    const calcFollowers = data?.followers || followers
    const calcEngagementRate = data?.engagementRate || engagementRate
    const calcPostFrequency = data?.postFrequency || postFrequency
    const calcHashtagReach = data?.hashtagReach || hashtagReach
    const calcContentType = data?.contentType || contentType
    const calcAccountAge = data?.accountAge || accountAge

    // Platform-specific reach factors
    const platformFactor =
      {
        instagram: 0.3,
        facebook: 0.16,
        twitter: 0.25,
        linkedin: 0.2,
        tiktok: 0.4,
        youtube: 0.15,
      }[calcPlatform] || 0.25

    // Content type factors
    const contentFactor =
      {
        image: 1.0,
        video: 1.5,
        carousel: 1.2,
        text: 0.8,
        story: 0.9,
        reel: 1.8,
      }[calcContentType] || 1.0

    // Account age factor (maturity helps with reach)
    const ageFactor = Math.min(1 + (calcAccountAge / 24) * 0.5, 1.5)

    // Calculate organic reach (followers who see your content)
    const organicReach = Math.round(calcFollowers * platformFactor * contentFactor * ageFactor)

    // Calculate viral reach based on engagement rate
    // Higher engagement = more likely to be shared/shown to non-followers
    const viralMultiplier = (calcEngagementRate / 100) * 10
    const viralReach = Math.round(organicReach * viralMultiplier)

    // Hashtag reach (percentage of additional reach from hashtags)
    const hashtagReachValue = Math.round(organicReach * (calcHashtagReach / 100))

    // Total reach
    const totalReach = organicReach + viralReach + hashtagReachValue

    // Impressions (views) are typically higher than reach (unique viewers)
    // People may see your content multiple times
    const impressions = Math.round(totalReach * 1.4)

    // Weekly and monthly reach projections
    const weeklyReach = totalReach * calcPostFrequency
    const monthlyReach = weeklyReach * 4

    setReachEstimate({
      organicReach,
      viralReach: viralReach + hashtagReachValue,
      totalReach,
      impressions,
      weeklyReach,
      monthlyReach,
    })

    // Determine reach quality
    if (totalReach < calcFollowers * 0.2) {
      setReachQuality("Low")
    } else if (totalReach >= calcFollowers * 0.2 && totalReach < calcFollowers * 0.5) {
      setReachQuality("Average")
    } else if (totalReach >= calcFollowers * 0.5 && totalReach < calcFollowers) {
      setReachQuality("Good")
    } else if (totalReach >= calcFollowers && totalReach < calcFollowers * 2) {
      setReachQuality("High")
    } else {
      setReachQuality("Excellent")
    }

    // If not loading from URL, switch to results tab
    if (!data) {
      setActiveTab("results")
    }
  }

  // Format large numbers
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  }

  // Prepare data for bar chart
  const getBarChartData = () => {
    return [
      { name: "Organic Reach", value: reachEstimate.organicReach },
      { name: "Viral Reach", value: reachEstimate.viralReach },
      { name: "Total Reach", value: reachEstimate.totalReach },
      { name: "Impressions", value: reachEstimate.impressions },
    ]
  }

  // Prepare data for pie chart
  const getPieChartData = () => {
    return [
      { name: "Organic Reach", value: reachEstimate.organicReach },
      { name: "Viral Reach", value: reachEstimate.viralReach },
    ]
  }

  // Prepare data for line chart (weekly projection)
  const getLineChartData = () => {
    const data = []
    const reachPerPost = reachEstimate.totalReach

    for (let i = 1; i <= 4; i++) {
      data.push({
        week: `Week ${i}`,
        reach: reachPerPost * postFrequency,
        impressions: Math.round(reachPerPost * postFrequency * 1.4),
      })
    }

    return data
  }

  // Colors for pie chart
  const COLORS = ["#3b82f6", "#93c5fd"]

  // Copy results to clipboard
  const copyToClipboard = () => {
    const text = `
Social Media Reach Estimator Results:
Platform: ${platform.charAt(0).toUpperCase() + platform.slice(1)}
Content Type: ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}
Followers: ${formatNumber(followers)}
Engagement Rate: ${formatPercentage(engagementRate)}
Post Frequency: ${postFrequency} posts per week
Hashtag Reach Boost: ${hashtagReach}%
Account Age: ${accountAge} months

Estimated Reach:
Organic Reach: ${formatNumber(reachEstimate.organicReach)}
Viral Reach: ${formatNumber(reachEstimate.viralReach)}
Total Reach per Post: ${formatNumber(reachEstimate.totalReach)}
Impressions per Post: ${formatNumber(reachEstimate.impressions)}
Weekly Reach: ${formatNumber(reachEstimate.weeklyReach)}
Monthly Reach: ${formatNumber(reachEstimate.monthlyReach)}

Reach Quality: ${reachQuality}
`

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Copied to clipboard",
        description: "The calculation results have been copied to your clipboard.",
      })
    })
  }

  // Share via URL
  const shareViaURL = () => {
    const baseUrl = window.location.origin + window.location.pathname
    const params = new URLSearchParams()

    params.set("platform", platform)
    params.set("followers", followers.toString())
    params.set("engagementRate", engagementRate.toString())
    params.set("postFrequency", postFrequency.toString())
    params.set("hashtagReach", hashtagReach.toString())
    params.set("contentType", contentType)
    params.set("accountAge", accountAge.toString())

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
          link.download = `reach-estimate-${platform}.png`
          link.href = dataUrl
          link.click()

          toast({
            title: "Image downloaded",
            description: "The calculation results have been downloaded as an image.",
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
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="results">Results & Visualizations</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Details</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="platform">Social Media Platform</Label>
                  <Select value={platform} onValueChange={(value) => setPlatform(value)}>
                    <SelectTrigger id="platform" className="mt-1">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="input-method">Input Method</Label>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="use-sliders" className="text-sm">
                        Use Sliders
                      </Label>
                      <Switch id="use-sliders" checked={useSliders} onCheckedChange={setUseSliders} />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="followers">Number of Followers: {formatNumber(followers)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="followers-slider"
                      min={100}
                      max={1000000}
                      step={100}
                      value={[followers]}
                      onValueChange={(value) => setFollowers(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="followers"
                      type="number"
                      value={followers}
                      onChange={(e) => setFollowers(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="engagementRate">Engagement Rate: {formatPercentage(engagementRate)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="engagementRate-slider"
                      min={0.1}
                      max={20}
                      step={0.1}
                      value={[engagementRate]}
                      onValueChange={(value) => setEngagementRate(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="engagementRate"
                      type="number"
                      value={engagementRate}
                      onChange={(e) => setEngagementRate(Number(e.target.value))}
                      className="mt-1"
                      step="0.1"
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="postFrequency">Posts per Week: {postFrequency}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="postFrequency-slider"
                      min={1}
                      max={21}
                      step={1}
                      value={[postFrequency]}
                      onValueChange={(value) => setPostFrequency(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="postFrequency"
                      type="number"
                      value={postFrequency}
                      onChange={(e) => setPostFrequency(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="hashtagReach">Hashtag Reach Boost: {hashtagReach}%</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="hashtagReach-slider"
                      min={0}
                      max={100}
                      step={5}
                      value={[hashtagReach]}
                      onValueChange={(value) => setHashtagReach(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="hashtagReach"
                      type="number"
                      value={hashtagReach}
                      onChange={(e) => setHashtagReach(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select value={contentType} onValueChange={(value) => setContentType(value)}>
                    <SelectTrigger id="contentType" className="mt-1">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image Post</SelectItem>
                      <SelectItem value="video">Video Post</SelectItem>
                      <SelectItem value="carousel">Carousel Post</SelectItem>
                      <SelectItem value="text">Text-only Post</SelectItem>
                      <SelectItem value="story">Story</SelectItem>
                      <SelectItem value="reel">Reel/Short Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="accountAge">Account Age (months): {accountAge}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="accountAge-slider"
                      min={1}
                      max={60}
                      step={1}
                      value={[accountAge]}
                      onValueChange={(value) => setAccountAge(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="accountAge"
                      type="number"
                      value={accountAge}
                      onChange={(e) => setAccountAge(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <Button onClick={() => calculateReach()} className="w-full">
                  Calculate Reach
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">About Reach Estimation</h2>

              <div className="space-y-4 text-sm">
                <p>
                  <strong>Reach</strong> is the number of unique users who see your content. It's different from
                  impressions, which count the total number of times your content is displayed.
                </p>

                <div className="bg-white p-4 rounded-md">
                  <h3 className="font-medium mb-2">Reach is influenced by:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your follower count</li>
                    <li>Engagement rate</li>
                    <li>Content type and quality</li>
                    <li>Posting frequency</li>
                    <li>Hashtag strategy</li>
                    <li>Platform algorithm</li>
                    <li>Account age and authority</li>
                  </ul>
                </div>

                <p>
                  <strong>Organic reach</strong> refers to the number of people who see your content without paid
                  promotion. <strong>Viral reach</strong> is additional visibility gained through shares and the
                  algorithm promoting your content to non-followers.
                </p>

                <h3 className="font-medium mt-4">Why reach matters:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Measures content visibility</li>
                  <li>Helps evaluate content strategy effectiveness</li>
                  <li>Provides insights for growth opportunities</li>
                  <li>Crucial for influencer marketing valuation</li>
                </ul>

                <div className="bg-blue-50 p-3 rounded-md mt-4">
                  <p className="text-xs">
                    <strong>Note:</strong> This calculator provides estimates based on industry averages and platform
                    trends. Actual reach may vary based on content quality, timing, and algorithm changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results">
          <div className="mt-6" ref={resultsRef}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Reach Estimation Results</h2>

              {reachEstimate.totalReach > 0 && (
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

            {reachEstimate.totalReach > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="overflow-hidden">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Total Reach per Post</div>
                      <div className="text-3xl font-bold text-primary flex items-center">
                        {formatNumber(reachEstimate.totalReach)}
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Estimated number of unique users who will see each post</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </div>
                      <div className="mt-2 text-sm">
                        Platform: <span className="font-medium capitalize">{platform}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Reach Quality</div>
                      <div className="text-2xl font-bold">{reachQuality}</div>
                      <div className="mt-2 text-sm">Followers: {formatNumber(followers)}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Reach Breakdown</h3>
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
                    <h3 className="text-lg font-medium mb-4">Reach Distribution</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                          >
                            {getPieChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [formatNumber(Number(value)), "Users"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">Monthly Projection</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getLineChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip formatter={(value) => [formatNumber(Number(value)), "Count"]} />
                          <Legend />
                          <Line type="monotone" dataKey="reach" stroke="#3b82f6" name="Reach" />
                          <Line type="monotone" dataKey="impressions" stroke="#93c5fd" name="Impressions" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Organic Reach</div>
                      <div className="text-2xl font-bold">{formatNumber(reachEstimate.organicReach)}</div>
                      <div className="text-xs text-muted-foreground mt-1">Followers who see your content</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Viral Reach</div>
                      <div className="text-2xl font-bold">{formatNumber(reachEstimate.viralReach)}</div>
                      <div className="text-xs text-muted-foreground mt-1">Non-followers who see your content</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Impressions</div>
                      <div className="text-2xl font-bold">{formatNumber(reachEstimate.impressions)}</div>
                      <div className="text-xs text-muted-foreground mt-1">Total views of your content</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Projected Reach</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground">Weekly Reach</div>
                      <div className="text-2xl font-bold">{formatNumber(reachEstimate.weeklyReach)}</div>
                      <div className="text-xs text-muted-foreground mt-1">Based on {postFrequency} posts per week</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground">Monthly Reach</div>
                      <div className="text-2xl font-bold">{formatNumber(reachEstimate.monthlyReach)}</div>
                      <div className="text-xs text-muted-foreground mt-1">Estimated total reach over 4 weeks</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Content Factors</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Content Type:</span>
                      <span className="font-medium capitalize">{contentType}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span>Engagement Rate:</span>
                      <span className="font-medium">{formatPercentage(engagementRate)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span>Hashtag Reach Boost:</span>
                      <span className="font-medium">{hashtagReach}%</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span>Account Age:</span>
                      <span className="font-medium">{accountAge} months</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-medium mb-3">Reach Benchmarks</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    <div
                      className={`p-3 rounded-lg border ${reachQuality === "Low" ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                    >
                      <div className="text-sm text-muted-foreground">Low</div>
                      <div className="font-medium">{"<"} 20% of followers</div>
                    </div>
                    <div
                      className={`p-3 rounded-lg border ${reachQuality === "Average" ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                    >
                      <div className="text-sm text-muted-foreground">Average</div>
                      <div className="font-medium">20-50% of followers</div>
                    </div>
                    <div
                      className={`p-3 rounded-lg border ${reachQuality === "Good" ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                    >
                      <div className="text-sm text-muted-foreground">Good</div>
                      <div className="font-medium">50-100% of followers</div>
                    </div>
                    <div
                      className={`p-3 rounded-lg border ${reachQuality === "High" ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                    >
                      <div className="text-sm text-muted-foreground">High</div>
                      <div className="font-medium">1-2x followers</div>
                    </div>
                    <div
                      className={`p-3 rounded-lg border ${reachQuality === "Excellent" ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                    >
                      <div className="text-sm text-muted-foreground">Excellent</div>
                      <div className="font-medium">{">"}2x followers</div>
                    </div>
                  </div>
                  <p className="text-xs mt-3 text-muted-foreground">
                    Note: Benchmarks vary by platform, industry, and account size.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">No results to display yet</div>
                <Button onClick={() => setActiveTab("calculator")}>Go to Calculator</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

