"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { Share2, Copy, Download, LinkIcon, Check, Info } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toPng } from "html-to-image"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams, useRouter } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function FollowerGrowthRateCalculator() {
  const [initialFollowers, setInitialFollowers] = useState(10000)
  const [currentFollowers, setCurrentFollowers] = useState(10200)
  const [timePeriod, setTimePeriod] = useState(30)
  const [timeUnit, setTimeUnit] = useState("days")
  const [platform, setPlatform] = useState("instagram")
  const [useSliders, setUseSliders] = useState(true)
  const [projectionMonths, setProjectionMonths] = useState(6)

  const [growthResults, setGrowthResults] = useState({
    growthRate: 0,
    absoluteGrowth: 0,
    dailyGrowth: 0,
    projectedFollowers: [] as { month: string; followers: number }[],
    growthQuality: "",
    annualizedGrowth: 0,
  })

  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("calculator")

  const resultsRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Industry benchmarks for different platforms (average monthly growth rates)
  const industryBenchmarks = {
    instagram: 2.1,
    facebook: 0.8,
    twitter: 1.4,
    tiktok: 4.2,
    youtube: 1.7,
    linkedin: 1.2,
  }

  // Load data from URL if available
  useEffect(() => {
    if (searchParams.has("platform")) {
      const platformParam = searchParams.get("platform") || "instagram"
      setPlatform(platformParam)
    }
  }, [searchParams])

  useEffect(() => {
    if (searchParams.has("initialFollowers") && searchParams.has("currentFollowers")) {
      const initialParam = Number.parseInt(searchParams.get("initialFollowers") || "10000")
      const currentParam = Number.parseInt(searchParams.get("currentFollowers") || "10200")
      const timePeriodParam = Number.parseInt(searchParams.get("timePeriod") || "30")
      const timeUnitParam = searchParams.get("timeUnit") || "days"
      const platformParam = searchParams.get("platform") || "instagram"
      const projectionMonthsParam = Number.parseInt(searchParams.get("projectionMonths") || "6")

      setInitialFollowers(initialParam)
      setCurrentFollowers(currentParam)
      setTimePeriod(timePeriodParam)
      setTimeUnit(timeUnitParam)
      setPlatform(platformParam)
      setProjectionMonths(projectionMonthsParam)

      // Calculate growth with loaded data
      calculateGrowthRate({
        initialFollowers: initialParam,
        currentFollowers: currentParam,
        timePeriod: timePeriodParam,
        timeUnit: timeUnitParam,
        platform: platformParam,
        projectionMonths: projectionMonthsParam,
      })

      // Switch to results tab
      setActiveTab("results")
    }
  }, [searchParams])

  const calculateGrowthRate = (data?: {
    initialFollowers: number
    currentFollowers: number
    timePeriod: number
    timeUnit: string
    platform: string
    projectionMonths: number
  }) => {
    // Use provided data or current state
    const calcInitialFollowers = data?.initialFollowers || initialFollowers
    const calcCurrentFollowers = data?.currentFollowers || currentFollowers
    const calcTimePeriod = data?.timePeriod || timePeriod
    const calcTimeUnit = data?.timeUnit || timeUnit
    const calcPlatform = data?.platform || platform
    const calcProjectionMonths = data?.projectionMonths || projectionMonths

    // Calculate absolute growth
    const absoluteGrowth = calcCurrentFollowers - calcInitialFollowers

    // Calculate growth rate percentage
    const growthRate = (absoluteGrowth / calcInitialFollowers) * 100

    // Convert time period to days for standardization
    let periodInDays = calcTimePeriod
    if (calcTimeUnit === "weeks") {
      periodInDays = calcTimePeriod * 7
    } else if (calcTimeUnit === "months") {
      periodInDays = calcTimePeriod * 30
    }

    // Calculate daily growth rate
    const dailyGrowth = absoluteGrowth / periodInDays

    // Calculate annualized growth rate (compound)
    const daysInYear = 365
    const growthFactor = 1 + growthRate / 100
    const periodsInYear = daysInYear / periodInDays
    const annualizedGrowth = (Math.pow(growthFactor, periodsInYear) - 1) * 100

    // Generate projection data for future months
    const projectedFollowers = []
    let projectedCount = calcCurrentFollowers

    // Get current date for month labels
    const currentDate = new Date()

    for (let i = 1; i <= calcProjectionMonths; i++) {
      // Calculate next month's date
      const nextMonth = new Date(currentDate)
      nextMonth.setMonth(currentDate.getMonth() + i)

      // Calculate compound growth for this period
      const monthlyGrowthFactor = Math.pow(growthFactor, 30 / periodInDays)
      projectedCount = Math.round(projectedCount * monthlyGrowthFactor)

      projectedFollowers.push({
        month: nextMonth.toLocaleString("default", { month: "short" }),
        followers: projectedCount,
      })
    }

    // Determine growth quality based on comparison to industry benchmarks
    // Convert growth rate to monthly equivalent for comparison
    const monthlyEquivalentGrowth = (growthRate / periodInDays) * 30
    const industryAverage = industryBenchmarks[calcPlatform as keyof typeof industryBenchmarks] || 2.0

    let growthQuality
    if (monthlyEquivalentGrowth < 0) {
      growthQuality = "Declining"
    } else if (monthlyEquivalentGrowth < industryAverage * 0.5) {
      growthQuality = "Below Average"
    } else if (monthlyEquivalentGrowth < industryAverage) {
      growthQuality = "Average"
    } else if (monthlyEquivalentGrowth < industryAverage * 2) {
      growthQuality = "Good"
    } else {
      growthQuality = "Excellent"
    }

    setGrowthResults({
      growthRate,
      absoluteGrowth,
      dailyGrowth,
      projectedFollowers,
      growthQuality,
      annualizedGrowth,
    })

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
  const formatPercentage = (value: number, fixed = 2) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(fixed)}%`
  }

  // Prepare data for growth comparison chart
  const getGrowthComparisonData = () => {
    const industryAverage = industryBenchmarks[platform as keyof typeof industryBenchmarks] || 2.0

    // Convert growth rate to monthly equivalent for comparison
    let periodInDays = timePeriod
    if (timeUnit === "weeks") {
      periodInDays = timePeriod * 7
    } else if (timeUnit === "months") {
      periodInDays = timePeriod * 30
    }

    const monthlyEquivalentGrowth = (growthResults.growthRate / periodInDays) * 30

    return [
      { name: "Your Growth", value: monthlyEquivalentGrowth },
      { name: "Industry Average", value: industryAverage },
    ]
  }

  // Prepare data for growth projection chart
  const getGrowthProjectionData = () => {
    // Start with current followers
    const data = [{ month: "Current", followers: currentFollowers }]

    // Add projected followers
    return [...data, ...growthResults.projectedFollowers]
  }

  // Colors for charts
  const COLORS = ["#3b82f6", "#93c5fd"]

  // Copy results to clipboard
  const copyToClipboard = () => {
    const text = `
Follower Growth Rate Calculator Results:
Platform: ${platform.charAt(0).toUpperCase() + platform.slice(1)}
Initial Followers: ${formatNumber(initialFollowers)}
Current Followers: ${formatNumber(currentFollowers)}
Time Period: ${timePeriod} ${timeUnit}

Growth Results:
Absolute Growth: ${formatNumber(growthResults.absoluteGrowth)} followers
Growth Rate: ${formatPercentage(growthResults.growthRate)}
Daily Growth: ${formatNumber(Math.round(growthResults.dailyGrowth))} followers per day
Annualized Growth: ${formatPercentage(growthResults.annualizedGrowth)}
Growth Quality: ${growthResults.growthQuality}

Projected Followers (${projectionMonths} months):
${growthResults.projectedFollowers.map((p) => `${p.month}: ${formatNumber(p.followers)}`).join("\n")}
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
    params.set("initialFollowers", initialFollowers.toString())
    params.set("currentFollowers", currentFollowers.toString())
    params.set("timePeriod", timePeriod.toString())
    params.set("timeUnit", timeUnit)
    params.set("projectionMonths", projectionMonths.toString())

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
          link.download = `follower-growth-${platform}.png`
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
          <TabsTrigger value="results">Results & Projections</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Follower Growth Details</h2>

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
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
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
                    <Label htmlFor="initialFollowers">Initial Followers: {formatNumber(initialFollowers)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="initialFollowers-slider"
                      min={100}
                      max={1000000}
                      step={100}
                      value={[initialFollowers]}
                      onValueChange={(value) => setInitialFollowers(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="initialFollowers"
                      type="number"
                      value={initialFollowers}
                      onChange={(e) => setInitialFollowers(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="currentFollowers">Current Followers: {formatNumber(currentFollowers)}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="currentFollowers-slider"
                      min={initialFollowers > 100 ? initialFollowers - 100 : 0}
                      max={initialFollowers * 2}
                      step={100}
                      value={[currentFollowers]}
                      onValueChange={(value) => setCurrentFollowers(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="currentFollowers"
                      type="number"
                      value={currentFollowers}
                      onChange={(e) => setCurrentFollowers(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between">
                      <Label htmlFor="timePeriod">Time Period: {timePeriod}</Label>
                    </div>
                    {useSliders ? (
                      <Slider
                        id="timePeriod-slider"
                        min={1}
                        max={timeUnit === "days" ? 90 : timeUnit === "weeks" ? 52 : 12}
                        step={1}
                        value={[timePeriod]}
                        onValueChange={(value) => setTimePeriod(value[0])}
                        className="mt-2"
                      />
                    ) : (
                      <Input
                        id="timePeriod"
                        type="number"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(Number(e.target.value))}
                        className="mt-1"
                      />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="timeUnit">Time Unit</Label>
                    <Select value={timeUnit} onValueChange={(value) => setTimeUnit(value)}>
                      <SelectTrigger id="timeUnit" className="mt-1">
                        <SelectValue placeholder="Select time unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="projectionMonths">Projection Months: {projectionMonths}</Label>
                  </div>
                  {useSliders ? (
                    <Slider
                      id="projectionMonths-slider"
                      min={1}
                      max={24}
                      step={1}
                      value={[projectionMonths]}
                      onValueChange={(value) => setProjectionMonths(value[0])}
                      className="mt-2"
                    />
                  ) : (
                    <Input
                      id="projectionMonths"
                      type="number"
                      value={projectionMonths}
                      onChange={(e) => setProjectionMonths(Number(e.target.value))}
                      className="mt-1"
                    />
                  )}
                </div>

                <Button onClick={() => calculateGrowthRate()} className="w-full">
                  Calculate Growth Rate
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">About Follower Growth Rate</h2>

              <div className="space-y-4 text-sm">
                <p>
                  <strong>Follower growth rate</strong> is a percentage that shows how quickly your audience is growing
                  (or declining) within a specific time period. It's a key metric for measuring the success of your
                  social media strategy.
                </p>

                <div className="bg-white p-4 rounded-md">
                  <h3 className="font-medium mb-2">Formula:</h3>
                  <div className="bg-muted p-2 rounded text-center">
                    Growth Rate = (Followers Gained / Initial Followers) × 100%
                  </div>
                </div>

                <p>
                  <strong>Example:</strong> If you had 10,000 followers at the beginning of June and 10,200 by the end,
                  your growth rate would be: (200 / 10,000) × 100 = 2% growth rate.
                </p>

                <h3 className="font-medium mt-4">Why growth rate matters:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Measures audience growth momentum</li>
                  <li>Helps evaluate content strategy effectiveness</li>
                  <li>Provides context for absolute follower numbers</li>
                  <li>Allows for comparison across accounts of different sizes</li>
                  <li>Helps predict future audience size</li>
                </ul>

                <div className="bg-blue-50 p-3 rounded-md mt-4">
                  <p className="text-xs">
                    <strong>Pro Tip:</strong> A consistent growth rate, even if modest, is often more valuable than
                    sporadic spikes followed by stagnation. Focus on sustainable growth strategies for long-term
                    success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results">
          <div className="mt-6" ref={resultsRef}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Growth Rate Results</h2>

              {growthResults.growthRate !== 0 && (
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

            {growthResults.growthRate !== 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="overflow-hidden">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Growth Rate</div>
                      <div className="text-3xl font-bold text-primary flex items-center">
                        {formatPercentage(growthResults.growthRate)}
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Percentage growth over {timePeriod} {timeUnit}
                              </p>
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
                      <div className="text-sm text-muted-foreground">Growth Quality</div>
                      <div className="text-2xl font-bold">{growthResults.growthQuality}</div>
                      <div className="mt-2 text-sm">
                        Annualized:{" "}
                        <span className="font-medium">{formatPercentage(growthResults.annualizedGrowth)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Follower Growth Projection</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getGrowthProjectionData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatNumber(Number(value)), "Followers"]} />
                        <Area type="monotone" dataKey="followers" stroke="#3b82f6" fill="#93c5fd" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">Growth Comparison</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getGrowthComparisonData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, "Monthly Growth Rate"]} />
                          <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">Growth Metrics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Initial Followers:</span>
                        <span className="font-medium">{formatNumber(initialFollowers)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span>Current Followers:</span>
                        <span className="font-medium">{formatNumber(currentFollowers)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span>Absolute Growth:</span>
                        <span className="font-medium">{formatNumber(growthResults.absoluteGrowth)} followers</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span>Time Period:</span>
                        <span className="font-medium">
                          {timePeriod} {timeUnit}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span>Daily Growth:</span>
                        <span className="font-medium">
                          {formatNumber(Math.round(growthResults.dailyGrowth))} followers/day
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Monthly Growth Rate</div>
                      <div className="text-2xl font-bold">
                        {formatPercentage(
                          (growthResults.growthRate / timePeriod) *
                            (timeUnit === "days" ? 30 : timeUnit === "weeks" ? 4.3 : 1),
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Standardized monthly rate</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Industry Average</div>
                      <div className="text-2xl font-bold">
                        {formatPercentage(industryBenchmarks[platform as keyof typeof industryBenchmarks] || 2.0, 1)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Monthly growth for {platform}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Projected in 6 Months</div>
                      <div className="text-2xl font-bold">
                        {growthResults.projectedFollowers.length >= 6
                          ? formatNumber(growthResults.projectedFollowers[5].followers)
                          : "Calculating..."}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Based on current growth rate</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Projected Follower Growth</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Month
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Projected Followers
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Growth from Current
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {growthResults.projectedFollowers.map((data, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {data.month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatNumber(data.followers)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatPercentage(((data.followers - currentFollowers) / currentFollowers) * 100, 1)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-medium mb-3">Growth Rate Benchmarks</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    <div
                      className={`p-3 rounded-lg border ${growthResults.growthQuality === "Declining" ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                    >
                      <div className="text-sm text-muted-foreground">Declining</div>
                      <div className="font-medium">Negative growth</div>
                    </div>
                    <div
                      className={`p-3 rounded-lg border ${growthResults.growthQuality === "Below Average" ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                    >
                      <div className="text-sm text-muted-foreground">Below Average</div>
                      <div className="font-medium">{"<"} 50% of industry</div>
                    </div>
                    <div
                      className={`p-3 rounded-lg border ${growthResults.growthQuality === "Average" ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                    >
                      <div className="text-sm text-muted-foreground">Average</div>
                      <div className="font-medium">50-100% of industry</div>
                    </div>
                    <div
                      className={`p-3 rounded-lg border ${growthResults.growthQuality === "Good" ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                    >
                      <div className="text-sm text-muted-foreground">Good</div>
                      <div className="font-medium">1-2x industry avg</div>
                    </div>
                    <div
                      className={`p-3 rounded-lg border ${growthResults.growthQuality === "Excellent" ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                    >
                      <div className="text-sm text-muted-foreground">Excellent</div>
                      <div className="font-medium">{">"}2x industry avg</div>
                    </div>
                  </div>
                  <p className="text-xs mt-3 text-muted-foreground">
                    Note: Industry average monthly growth rate for {platform} is approximately{" "}
                    {formatPercentage(industryBenchmarks[platform as keyof typeof industryBenchmarks] || 2.0, 1)}.
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

