"use client"

import type React from "react"

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
} from "recharts"
import { Share2, Copy, Download, LinkIcon, Check, Info, Search } from "lucide-react"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toPng } from "html-to-image"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams, useRouter } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

// Add this function near the top of the file, outside the component
const simulateChannelData = (channelUrl: string) => {
  // Extract channel ID or username from URL
  const channelIdentifier = channelUrl.includes("youtube.com") ? channelUrl.split("/").pop() : channelUrl

  // Generate realistic-looking data based on the channel identifier
  const hash = channelIdentifier?.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) || 1000

  // Use the hash to generate somewhat deterministic but random-looking values
  const simulatedViews = Math.floor(hash * 7.5) + 5000
  const simulatedLikes = Math.floor(simulatedViews * (0.05 + (hash % 10) / 100))
  const simulatedComments = Math.floor(simulatedLikes * 0.2)
  const simulatedShares = Math.floor(simulatedLikes * 0.1)
  const simulatedSubscribers = Math.floor(hash * 2.3) + 1000
  const simulatedNewSubscribers = Math.floor(simulatedViews * 0.01)
  const simulatedWatchTime = Math.floor(180 + (hash % 300))
  const simulatedVideoDuration = Math.floor(300 + (hash % 600))
  const simulatedTotalVideos = Math.floor(hash % 100) + 10
  const simulatedTotalViews = simulatedSubscribers * (50 + (hash % 200))

  return {
    channelId: channelIdentifier,
    title: `Channel ${channelIdentifier}`,
    thumbnail: `/placeholder.svg?height=48&width=48`,
    statistics: {
      subscribers: simulatedSubscribers,
      totalViews: simulatedTotalViews,
      totalVideos: simulatedTotalVideos,
    },
    engagement: {
      views: simulatedViews,
      likes: simulatedLikes,
      comments: simulatedComments,
      shares: simulatedShares,
      watchTime: simulatedWatchTime,
      videoDuration: simulatedVideoDuration,
      subscribersGained: simulatedNewSubscribers,
    },
    recentVideos: Array(3)
      .fill(0)
      .map((_, i) => ({
        id: `video-${i}`,
        title: `Video ${i + 1} - ${channelIdentifier}`,
        thumbnail: `/placeholder.svg?height=72&width=128`,
        views: Math.floor(simulatedViews * (0.8 + Math.random() * 0.4)),
        likes: Math.floor(simulatedLikes * (0.8 + Math.random() * 0.4)),
        comments: Math.floor(simulatedComments * (0.8 + Math.random() * 0.4)),
      })),
  }
}

export default function EngagementRateCalculator() {
  const [followers, setFollowers] = useState(10000)
  const [likes, setLikes] = useState(500)
  const [comments, setComments] = useState(50)
  const [shares, setShares] = useState(20)
  const [saves, setSaves] = useState(30)
  const [platform, setPlatform] = useState("instagram")

  const [engagementRate, setEngagementRate] = useState(0)
  const [engagementQuality, setEngagementQuality] = useState("")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("calculator")
  const [inputMethod, setInputMethod] = useState("manual")
  const [channelUrl, setChannelUrl] = useState("")
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [useSliders, setUseSliders] = useState(true)

  const [views, setViews] = useState(1000)
  const [watchTime, setWatchTime] = useState(120)
  const [videoDuration, setVideoDuration] = useState(300)
  const [subscribersGained, setSubscribersGained] = useState(5)

  const [youTubeMetrics, setYouTubeMetrics] = useState({
    retentionRate: 0,
    subscriberConversionRate: 0,
  })

  const [channelInfo, setChannelInfo] = useState<{
    title: string
    thumbnail: string
    totalVideos: number
    totalViews: number
    recentVideos: any[]
  } | null>(null)

  const resultsRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Load data from URL if available
  useEffect(() => {
    // If platform parameter exists in URL, use it, otherwise check if we should default to YouTube
    if (searchParams.has("platform")) {
      const platformParam = searchParams.get("platform") || "instagram"
      setPlatform(platformParam)

      // If YouTube is selected, also set inputMethod to "url" for better UX
      if (platformParam === "youtube") {
        setInputMethod("url")
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (searchParams.has("platform")) {
      const platformParam = searchParams.get("platform") || "instagram"
      const followersParam = Number.parseInt(searchParams.get("followers") || "10000")
      const likesParam = Number.parseInt(searchParams.get("likes") || "500")
      const commentsParam = Number.parseInt(searchParams.get("comments") || "50")
      const sharesParam = Number.parseInt(searchParams.get("shares") || "20")
      const savesParam = Number.parseInt(searchParams.get("saves") || "30")

      // YouTube-specific parameters
      const viewsParam = Number.parseInt(searchParams.get("views") || "1000")
      const watchTimeParam = Number.parseInt(searchParams.get("watchTime") || "120")
      const videoDurationParam = Number.parseInt(searchParams.get("videoDuration") || "300")
      const subscribersGainedParam = Number.parseInt(searchParams.get("subscribersGained") || "5")

      setPlatform(platformParam)
      setFollowers(followersParam)
      setLikes(likesParam)
      setComments(commentsParam)
      setShares(sharesParam)
      setSaves(savesParam)

      // Set YouTube-specific state if applicable
      if (platformParam === "youtube") {
        setViews(viewsParam)
        setWatchTime(watchTimeParam)
        setVideoDuration(videoDurationParam)
        setSubscribersGained(subscribersGainedParam)
      }

      // Calculate engagement rate with loaded data
      calculateEngagementRate({
        platform: platformParam,
        followers: followersParam,
        likes: likesParam,
        comments: commentsParam,
        shares: sharesParam,
        saves: savesParam,
        views: viewsParam,
        watchTime: watchTimeParam,
        videoDuration: videoDurationParam,
        subscribersGained: subscribersGainedParam,
      })

      // Switch to results tab
      setActiveTab("results")
    }
  }, [searchParams])

  // Cleanup debounce timer when component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  const calculateEngagementRate = (data?: {
    platform: string
    followers: number
    likes: number
    comments: number
    shares: number
    saves: number
    views?: number
    watchTime?: number
    videoDuration?: number
    subscribersGained?: number
  }) => {
    // Use provided data or current state
    const calcPlatform = data?.platform || platform
    const calcFollowers = data?.followers || followers
    const calcLikes = data?.likes || likes
    const calcComments = data?.comments || comments
    const calcShares = data?.shares || shares
    const calcSaves = data?.saves || saves
    const calcViews = data?.views || views
    const calcWatchTime = data?.watchTime || watchTime
    const calcVideoDuration = data?.videoDuration || videoDuration
    const calcSubscribersGained = data?.subscribersGained || subscribersGained

    let totalEngagements = calcLikes + calcComments
    let rate = 0

    // YouTube uses a different calculation method
    if (calcPlatform === "youtube") {
      // Calculate engagement based on views rather than followers
      totalEngagements = calcLikes + calcComments + calcShares

      // Calculate engagement rate (engagements per view)
      rate = (totalEngagements / calcViews) * 100

      // Calculate retention rate (average watch time / video duration)
      const retentionRate = (calcWatchTime / calcVideoDuration) * 100

      // Factor in retention rate and subscriber conversion
      const subscriberConversionRate = (calcSubscribersGained / calcViews) * 100

      // Store additional metrics for YouTube
      setYouTubeMetrics({
        retentionRate,
        subscriberConversionRate,
      })
    } else {
      // Add platform-specific metrics for other platforms
      if (calcPlatform === "instagram" || calcPlatform === "facebook") {
        totalEngagements += calcSaves
      }

      if (calcPlatform === "twitter" || calcPlatform === "facebook") {
        totalEngagements += calcShares
      }

      // Calculate engagement rate (standard method)
      rate = (totalEngagements / calcFollowers) * 100
    }

    setEngagementRate(rate)

    // Determine engagement quality
    // YouTube has different benchmarks
    if (calcPlatform === "youtube") {
      if (rate < 3) {
        setEngagementQuality("Low")
      } else if (rate >= 3 && rate < 6) {
        setEngagementQuality("Good")
      } else if (rate >= 6 && rate < 10) {
        setEngagementQuality("High")
      } else {
        setEngagementQuality("Very High")
      }
    } else {
      if (rate < 1) {
        setEngagementQuality("Low")
      } else if (rate >= 1 && rate < 3.5) {
        setEngagementQuality("Good")
      } else if (rate >= 3.5 && rate < 6) {
        setEngagementQuality("High")
      } else {
        setEngagementQuality("Very High")
      }
    }

    // If not loading from URL, switch to results tab
    if (!data) {
      setActiveTab("results")
    }
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
    if (platform === "youtube") {
      return [
        { name: "Likes", value: likes },
        { name: "Comments", value: comments },
        { name: "Shares", value: shares },
        { name: "New Subscribers", value: subscribersGained },
      ]
    }

    const data = [
      { name: "Likes", value: likes },
      { name: "Comments", value: comments },
    ]

    if (platform === "instagram" || platform === "facebook") {
      data.push({ name: "Saves", value: saves })
    }

    if (platform === "twitter" || platform === "facebook") {
      data.push({ name: "Shares", value: shares })
    }

    return data
  }

  // Prepare data for pie chart
  const getPieChartData = () => {
    if (platform === "youtube") {
      const totalEngagements = likes + comments + shares
      return [
        { name: "Engaged", value: totalEngagements },
        { name: "Not Engaged", value: views - totalEngagements },
      ]
    }

    let totalEngagements = likes + comments

    if (platform === "instagram" || platform === "facebook") {
      totalEngagements += saves
    }

    if (platform === "twitter" || platform === "facebook") {
      totalEngagements += shares
    }

    return [
      { name: "Engaged", value: totalEngagements },
      { name: "Not Engaged", value: followers - totalEngagements },
    ]
  }

  // Colors for pie chart
  const COLORS = ["#3b82f6", "#e5e7eb"]

  // Copy results to clipboard
  const copyToClipboard = () => {
    let text = `
Social Media Engagement Rate Calculator Results:
Platform: ${platform.charAt(0).toUpperCase() + platform.slice(1)}
`

    if (platform === "youtube") {
      text += `
Views: ${views.toLocaleString()}
Likes: ${likes.toLocaleString()}
Comments: ${comments.toLocaleString()}
Shares: ${shares.toLocaleString()}
New Subscribers: ${subscribersGained.toLocaleString()}
Average Watch Time: ${formatTime(watchTime)}
Retention Rate: ${formatPercentage(youTubeMetrics.retentionRate)}
Subscriber Conversion: ${formatPercentage(youTubeMetrics.subscriberConversionRate)}
Engagement Rate: ${formatPercentage(engagementRate)}
Engagement Quality: ${engagementQuality}
`
    } else {
      text += `
Followers: ${followers.toLocaleString()}
Likes: ${likes.toLocaleString()}
Comments: ${comments.toLocaleString()}
${platform === "twitter" || platform === "facebook" ? `Shares: ${shares.toLocaleString()}\n` : ""}
${platform === "instagram" || platform === "facebook" ? `Saves: ${saves.toLocaleString()}\n` : ""}
Engagement Rate: ${formatPercentage(engagementRate)}
Engagement Quality: ${engagementQuality}
`
    }

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
    params.set("likes", likes.toString())
    params.set("comments", comments.toString())
    params.set("shares", shares.toString())
    params.set("saves", saves.toString())

    // Add YouTube-specific parameters if applicable
    if (platform === "youtube") {
      params.set("views", views.toString())
      params.set("watchTime", watchTime.toString())
      params.set("videoDuration", videoDuration.toString())
      params.set("subscribersGained", subscribersGained.toString())
    }

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
          link.download = `engagement-rate-${platform}.png`
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Fetch channel data
  const fetchChannelData = async () => {
    if (!channelUrl) {
      toast({
        title: "Error",
        description: "Please enter a channel URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      let data

      try {
        // Try to call our API route with the channel URL
        const response = await fetch(`/api/youtube?url=${encodeURIComponent(channelUrl)}`)

        if (!response.ok) {
          throw new Error("API route not available")
        }

        data = await response.json()
      } catch (apiError) {
        console.warn("API route error, using simulated data:", apiError)
        // If the API route fails, use simulated data
        data = simulateChannelData(channelUrl)

        toast({
          title: "Using simulated data",
          description: "The API is currently unavailable. Using simulated data for demonstration.",
        })
      }

      // Update state with the fetched or simulated data
      setViews(data.engagement.views)
      setLikes(data.engagement.likes)
      setComments(data.engagement.comments)
      setShares(data.engagement.shares)
      setFollowers(data.statistics.subscribers)
      setSubscribersGained(data.engagement.subscribersGained)
      setWatchTime(data.engagement.watchTime)
      setVideoDuration(data.engagement.videoDuration)

      // Set channel info
      setChannelInfo({
        title: data.title,
        thumbnail: data.thumbnail,
        totalVideos: data.statistics.totalVideos,
        totalViews: data.statistics.totalViews,
        recentVideos: data.recentVideos,
      })

      // Calculate engagement with new data
      calculateEngagementRate({
        platform: "youtube",
        followers: data.statistics.subscribers,
        likes: data.engagement.likes,
        comments: data.engagement.comments,
        shares: data.engagement.shares,
        saves: 0,
        views: data.engagement.views,
        watchTime: data.engagement.watchTime,
        videoDuration: data.engagement.videoDuration,
        subscribersGained: data.engagement.subscribersGained,
      })

      toast({
        title: "Channel data loaded",
        description: `Successfully loaded data for ${data.title}`,
      })

      // Automatically switch to results tab
      setActiveTab("results")
    } catch (error: any) {
      console.error("Error fetching channel data:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch channel data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Get pasted content
    const pastedText = e.clipboardData.getData("text")

    // If it's a valid URL or channel ID (at least 10 chars), trigger fetch
    if (pastedText.length > 10) {
      // Set a small timeout to allow the input value to update first
      setTimeout(() => {
        fetchChannelData()
      }, 100)
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
              <h2 className="text-xl font-semibold mb-4">Post Details</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="platform">Social Media Platform</Label>
                  <Select
                    value={platform}
                    onValueChange={(value) => {
                      setPlatform(value)
                      if (value === "youtube" && inputMethod === "url") {
                        // Auto-switch to URL input method for YouTube
                        setInputMethod("url")
                      }
                    }}
                  >
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

                {platform === "youtube" && (
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
                    <RadioGroup value={inputMethod} onValueChange={setInputMethod} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manual" id="manual" />
                        <Label htmlFor="manual">Manual Entry</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="url" id="url" />
                        <Label htmlFor="url">Channel URL</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {platform === "youtube" && inputMethod === "url" ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="channel-url">YouTube Channel URL or ID</Label>
                      <div className="flex mt-1">
                        <Input
                          id="channel-url"
                          type="text"
                          value={channelUrl}
                          onChange={(e) => {
                            setChannelUrl(e.target.value)

                            // Clear any existing timer
                            if (debounceTimer) {
                              clearTimeout(debounceTimer)
                            }

                            // If input is cleared, don't trigger fetch
                            if (!e.target.value) return

                            // For typing, use a longer debounce to avoid excessive fetches
                            const timer = setTimeout(() => {
                              if (e.target.value.length > 10) {
                                fetchChannelData()
                              }
                            }, 1500) // 1.5 second debounce for typing

                            setDebounceTimer(timer)
                          }}
                          onPaste={handlePaste}
                          placeholder="e.g., youtube.com/c/channelname"
                          className="rounded-r-none"
                        />
                        <Button
                          onClick={fetchChannelData}
                          disabled={isLoading || !channelUrl}
                          className="rounded-l-none"
                        >
                          {isLoading ? "Loading..." : <Search className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Paste a YouTube channel URL to automatically fetch engagement data
                      </p>
                    </div>

                    {isLoading && (
                      <div className="flex justify-center py-8">
                        <div className="animate-pulse text-center">
                          <p>Fetching channel data...</p>
                          <p className="text-xs text-muted-foreground mt-1">This may take a moment</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {platform !== "youtube" && (
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="followers">Number of Followers: {followers.toLocaleString()}</Label>
                        </div>
                        {useSliders ? (
                          <>
                            <Slider
                              id="followers-slider"
                              min={100}
                              max={1000000}
                              step={100}
                              value={[followers]}
                              onValueChange={(value) => setFollowers(value[0])}
                              className="mt-2"
                            />
                          </>
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
                    )}

                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="likes">Likes: {likes.toLocaleString()}</Label>
                      </div>
                      {useSliders ? (
                        <Slider
                          id="likes-slider"
                          min={0}
                          max={platform === "youtube" ? 50000 : 5000}
                          step={10}
                          value={[likes]}
                          onValueChange={(value) => setLikes(value[0])}
                          className="mt-2"
                        />
                      ) : (
                        <Input
                          id="likes"
                          type="number"
                          value={likes}
                          onChange={(e) => setLikes(Number(e.target.value))}
                          className="mt-1"
                        />
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between">
                        <Label htmlFor="comments">Comments: {comments.toLocaleString()}</Label>
                      </div>
                      {useSliders ? (
                        <Slider
                          id="comments-slider"
                          min={0}
                          max={platform === "youtube" ? 5000 : 1000}
                          step={5}
                          value={[comments]}
                          onValueChange={(value) => setComments(value[0])}
                          className="mt-2"
                        />
                      ) : (
                        <Input
                          id="comments"
                          type="number"
                          value={comments}
                          onChange={(e) => setComments(Number(e.target.value))}
                          className="mt-1"
                        />
                      )}
                    </div>

                    {(platform === "twitter" || platform === "facebook" || platform === "youtube") && (
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="shares">
                            {platform === "twitter" ? "Retweets" : "Shares"}: {shares.toLocaleString()}
                          </Label>
                        </div>
                        {useSliders ? (
                          <Slider
                            id="shares-slider"
                            min={0}
                            max={platform === "youtube" ? 2000 : 500}
                            step={5}
                            value={[shares]}
                            onValueChange={(value) => setShares(value[0])}
                            className="mt-2"
                          />
                        ) : (
                          <Input
                            id="shares"
                            type="number"
                            value={shares}
                            onChange={(e) => setShares(Number(e.target.value))}
                            className="mt-1"
                          />
                        )}
                      </div>
                    )}

                    {(platform === "instagram" || platform === "facebook") && (
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="saves">Saves/Bookmarks: {saves.toLocaleString()}</Label>
                        </div>
                        {useSliders ? (
                          <Slider
                            id="saves-slider"
                            min={0}
                            max={300}
                            step={5}
                            value={[saves]}
                            onValueChange={(value) => setSaves(value[0])}
                            className="mt-2"
                          />
                        ) : (
                          <Input
                            id="saves"
                            type="number"
                            value={saves}
                            onChange={(e) => setSaves(Number(e.target.value))}
                            className="mt-1"
                          />
                        )}
                      </div>
                    )}

                    {platform === "youtube" && (
                      <>
                        <div>
                          <div className="flex justify-between">
                            <Label htmlFor="views">Video Views: {views.toLocaleString()}</Label>
                          </div>
                          {useSliders ? (
                            <Slider
                              id="views-slider"
                              min={100}
                              max={1000000}
                              step={100}
                              value={[views]}
                              onValueChange={(value) => setViews(value[0])}
                              className="mt-2"
                            />
                          ) : (
                            <Input
                              id="views"
                              type="number"
                              value={views}
                              onChange={(e) => setViews(Number(e.target.value))}
                              className="mt-1"
                            />
                          )}
                        </div>

                        <div>
                          <div className="flex justify-between">
                            <Label htmlFor="watchTime">Average Watch Time: {formatTime(watchTime)}</Label>
                          </div>
                          {useSliders ? (
                            <Slider
                              id="watchTime-slider"
                              min={10}
                              max={1800}
                              step={10}
                              value={[watchTime]}
                              onValueChange={(value) => setWatchTime(value[0])}
                              className="mt-2"
                            />
                          ) : (
                            <Input
                              id="watchTime"
                              type="number"
                              value={watchTime}
                              onChange={(e) => setWatchTime(Number(e.target.value))}
                              className="mt-1"
                            />
                          )}
                        </div>

                        <div>
                          <div className="flex justify-between">
                            <Label htmlFor="videoDuration">Video Duration: {formatTime(videoDuration)}</Label>
                          </div>
                          {useSliders ? (
                            <Slider
                              id="videoDuration-slider"
                              min={30}
                              max={3600}
                              step={30}
                              value={[videoDuration]}
                              onValueChange={(value) => setVideoDuration(value[0])}
                              className="mt-2"
                            />
                          ) : (
                            <Input
                              id="videoDuration"
                              type="number"
                              value={videoDuration}
                              onChange={(e) => setVideoDuration(Number(e.target.value))}
                              className="mt-1"
                            />
                          )}
                        </div>

                        <div>
                          <div className="flex justify-between">
                            <Label htmlFor="subscribersGained">
                              New Subscribers: {subscribersGained.toLocaleString()}
                            </Label>
                          </div>
                          {useSliders ? (
                            <Slider
                              id="subscribersGained-slider"
                              min={0}
                              max={1000}
                              step={1}
                              value={[subscribersGained]}
                              onValueChange={(value) => setSubscribersGained(value[0])}
                              className="mt-2"
                            />
                          ) : (
                            <Input
                              id="subscribersGained"
                              type="number"
                              value={subscribersGained}
                              onChange={(e) => setSubscribersGained(Number(e.target.value))}
                              className="mt-1"
                            />
                          )}
                        </div>
                      </>
                    )}

                    <Button onClick={() => calculateEngagementRate()} className="w-full">
                      Calculate Engagement Rate
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                About {platform === "youtube" ? "YouTube" : ""} Engagement Rate
              </h2>

              <div className="space-y-4 text-sm">
                {platform === "youtube" ? (
                  <>
                    <p>
                      <strong>YouTube engagement rate</strong> measures how actively viewers interact with your videos.
                      Unlike other platforms, YouTube engagement is typically calculated based on views rather than
                      followers or subscribers.
                    </p>

                    <div className="bg-white p-4 rounded-md">
                      <h3 className="font-medium mb-2">YouTube Formula:</h3>
                      <div className="bg-muted p-2 rounded text-center">
                        Engagement Rate = (Likes + Comments + Shares) / Views × 100%
                      </div>
                    </div>

                    <p>
                      <strong>Additional metrics</strong> like watch time, retention rate, and subscriber conversion
                      provide deeper insights into content performance.
                    </p>

                    <h3 className="font-medium mt-4">Why YouTube metrics matter:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>YouTube algorithm prioritizes engagement for recommendations</li>
                      <li>Higher retention rates improve video ranking</li>
                      <li>Subscriber growth indicates channel health</li>
                      <li>Engagement affects monetization potential</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Engagement rate</strong> measures how actively involved your audience is with your
                      content. It's calculated by dividing total engagements by your follower count.
                    </p>

                    <div className="bg-white p-4 rounded-md">
                      <h3 className="font-medium mb-2">Formula:</h3>
                      <div className="bg-muted p-2 rounded text-center">
                        Engagement Rate = (Total Engagements / Followers) × 100%
                      </div>
                    </div>

                    <p>
                      <strong>Total engagements</strong> typically include likes, comments, shares, and saves, though
                      this varies by platform.
                    </p>

                    <h3 className="font-medium mt-4">Why it matters:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Measures content effectiveness</li>
                      <li>Indicates audience quality</li>
                      <li>Helps optimize content strategy</li>
                      <li>Important for influencer marketing</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results">
          <div className="mt-6" ref={resultsRef}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Engagement Results</h2>

              {engagementRate > 0 && (
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

            {engagementRate > 0 ? (
              <div className="space-y-8">
                {/* Channel info section - moved to the top */}
                {platform === "youtube" && channelInfo && (
                  <div className="bg-white p-6 rounded-lg border mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      {channelInfo.thumbnail && (
                        <img
                          src={channelInfo.thumbnail || "/placeholder.svg"}
                          alt={channelInfo.title}
                          className="w-16 h-16 rounded-full"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-medium">{channelInfo.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          {channelInfo.totalVideos.toLocaleString()} videos • {channelInfo.totalViews.toLocaleString()}{" "}
                          total views
                        </div>
                      </div>
                    </div>

                    {channelInfo.recentVideos && channelInfo.recentVideos.length > 0 && (
                      <>
                        <h4 className="font-medium mt-4 mb-2">Recent Videos</h4>
                        <div className="space-y-3">
                          {channelInfo.recentVideos.slice(0, 3).map((video) => (
                            <div key={video.id} className="flex gap-3">
                              {video.thumbnail && (
                                <img
                                  src={video.thumbnail || "/placeholder.svg"}
                                  alt={video.title}
                                  className="w-24 h-auto rounded"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{video.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {video.views.toLocaleString()} views • {video.likes.toLocaleString()} likes
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="overflow-hidden">
                    <CardContent className="pt-6">
                      <div className="text-sm text-muted-foreground">Engagement Rate</div>
                      <div className="text-3xl font-bold text-primary flex items-center">
                        {formatPercentage(engagementRate)}
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 ml-2 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                {platform === "youtube"
                                  ? "Percentage of viewers who engaged with your video"
                                  : "Percentage of followers who engage with your content"}
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
                      <div className="text-sm text-muted-foreground">Engagement Quality</div>
                      <div className="text-2xl font-bold">{engagementQuality}</div>
                      <div className="mt-2 text-sm">
                        {platform === "youtube"
                          ? `Views: ${views.toLocaleString()}`
                          : `Followers: ${followers.toLocaleString()}`}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Engagement Breakdown</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getBarChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [Number(value).toLocaleString(), "Count"]} />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">Audience Engagement</h3>
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
                          <Tooltip formatter={(value) => [Number(value).toLocaleString(), "Count"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {platform === "youtube" && (
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">YouTube Metrics</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Views:</span>
                          <span className="font-medium">{views.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Likes:</span>
                          <span className="font-medium">{likes.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Comments:</span>
                          <span className="font-medium">{comments.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Shares:</span>
                          <span className="font-medium">{shares.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>New Subscribers:</span>
                          <span className="font-medium">{subscribersGained.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Avg. Watch Time:</span>
                          <span className="font-medium">{formatTime(watchTime)}</span>
                        </div>
                        <div className="pt-4 border-t mt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Engagements:</span>
                            <span className="font-medium">{(likes + comments + shares).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {platform !== "youtube" && (
                    <div className="bg-white p-6 rounded-lg border">
                      <h3 className="text-lg font-medium mb-4">Engagement Metrics</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Likes:</span>
                          <span className="font-medium">{likes.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Comments:</span>
                          <span className="font-medium">{comments.toLocaleString()}</span>
                        </div>
                        {(platform === "twitter" || platform === "facebook") && (
                          <div className="flex justify-between items-center">
                            <span>Shares/Retweets:</span>
                            <span className="font-medium">{shares.toLocaleString()}</span>
                          </div>
                        )}
                        {(platform === "instagram" || platform === "facebook") && (
                          <div className="flex justify-between items-center">
                            <span>Saves/Bookmarks:</span>
                            <span className="font-medium">{saves.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="pt-4 border-t mt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Engagements:</span>
                            <span className="font-medium">
                              {(
                                likes +
                                comments +
                                (platform === "twitter" || platform === "facebook" ? shares : 0) +
                                (platform === "instagram" || platform === "facebook" ? saves : 0)
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {platform === "youtube" && engagementRate > 0 && (
                  <div className="mt-6 bg-white p-6 rounded-lg border">
                    <h3 className="text-lg font-medium mb-4">YouTube Performance Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="text-sm text-muted-foreground">Retention Rate</div>
                        <div className="text-xl font-bold">{formatPercentage(youTubeMetrics.retentionRate)}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Average watch time as percentage of video duration
                        </div>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="text-sm text-muted-foreground">Subscriber Conversion</div>
                        <div className="text-xl font-bold">
                          {formatPercentage(youTubeMetrics.subscriberConversionRate)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Percentage of viewers who subscribed</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-medium mb-3">Engagement Rate Benchmarks</h3>
                  {platform === "youtube" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div
                        className={`p-3 rounded-lg border ${engagementRate < 3 ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                      >
                        <div className="text-sm text-muted-foreground">Low</div>
                        <div className="font-medium">Less than 3%</div>
                      </div>
                      <div
                        className={`p-3 rounded-lg border ${engagementRate >= 3 && engagementRate < 6 ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                      >
                        <div className="text-sm text-muted-foreground">Good</div>
                        <div className="font-medium">3% - 6%</div>
                      </div>
                      <div
                        className={`p-3 rounded-lg border ${engagementRate >= 6 && engagementRate < 10 ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                      >
                        <div className="text-sm text-muted-foreground">High</div>
                        <div className="font-medium">6% - 10%</div>
                      </div>
                      <div
                        className={`p-3 rounded-lg border ${engagementRate >= 10 ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                      >
                        <div className="text-sm text-muted-foreground">Very High</div>
                        <div className="font-medium">Above 10%</div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div
                        className={`p-3 rounded-lg border ${engagementRate < 1 ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                      >
                        <div className="text-sm text-muted-foreground">Low</div>
                        <div className="font-medium">Less than 1%</div>
                      </div>
                      <div
                        className={`p-3 rounded-lg border ${engagementRate >= 1 && engagementRate < 3.5 ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                      >
                        <div className="text-sm text-muted-foreground">Good</div>
                        <div className="font-medium">1% - 3.5%</div>
                      </div>
                      <div
                        className={`p-3 rounded-lg border ${engagementRate >= 3.5 && engagementRate < 6 ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                      >
                        <div className="text-sm text-muted-foreground">High</div>
                        <div className="font-medium">3.5% - 6%</div>
                      </div>
                      <div
                        className={`p-3 rounded-lg border ${engagementRate >= 6 ? "bg-white border-blue-500 shadow-sm" : "bg-transparent"}`}
                      >
                        <div className="text-sm text-muted-foreground">Very High</div>
                        <div className="font-medium">Above 6%</div>
                      </div>
                    </div>
                  )}
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

