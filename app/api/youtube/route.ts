import { NextResponse } from "next/server"

// YouTube API endpoint constants
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3"
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

// Helper function to extract channel ID from various URL formats
function extractChannelId(url: string): string | null {
  // Handle different YouTube URL formats
  const patterns = [
    /youtube\.com\/channel\/([^/?]+)/, // youtube.com/channel/UC...
    /youtube\.com\/c\/([^/?]+)/, // youtube.com/c/channelname
    /youtube\.com\/@([^/?]+)/, // youtube.com/@channelname
    /youtube\.com\/user\/([^/?]+)/, // youtube.com/user/username
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  // If it's already just a channel ID
  if (url.startsWith("UC") && url.length > 10) {
    return url
  }

  return null
}

// Helper function to fetch channel data by ID or username
async function fetchChannelData(identifier: string) {
  let channelId = identifier

  // If it doesn't look like a channel ID (doesn't start with UC),
  // try to find the channel ID by username or handle
  if (!identifier.startsWith("UC")) {
    // For handles (@username) or custom URLs (youtube.com/c/name)
    const searchResponse = await fetch(
      `${YOUTUBE_API_BASE_URL}/search?part=snippet&q=${encodeURIComponent(identifier)}&type=channel&key=${YOUTUBE_API_KEY}`,
    )

    if (!searchResponse.ok) {
      throw new Error("Failed to search for channel")
    }

    const searchData = await searchResponse.json()
    if (searchData.items && searchData.items.length > 0) {
      channelId = searchData.items[0].id.channelId
    } else {
      throw new Error("Channel not found")
    }
  }

  // Fetch channel statistics
  const channelResponse = await fetch(
    `${YOUTUBE_API_BASE_URL}/channels?part=statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`,
  )

  if (!channelResponse.ok) {
    throw new Error("Failed to fetch channel data")
  }

  const channelData = await channelResponse.json()
  if (!channelData.items || channelData.items.length === 0) {
    throw new Error("Channel not found")
  }

  return channelData.items[0]
}

// Helper function to fetch recent videos
async function fetchRecentVideos(channelId: string, maxResults = 5) {
  const videosResponse = await fetch(
    `${YOUTUBE_API_BASE_URL}/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`,
  )

  if (!videosResponse.ok) {
    throw new Error("Failed to fetch recent videos")
  }

  const videosData = await videosResponse.json()
  if (!videosData.items) {
    return []
  }

  // Get video IDs
  const videoIds = videosData.items.map((item: any) => item.id.videoId).join(",")

  // Fetch detailed video statistics
  const videoStatsResponse = await fetch(
    `${YOUTUBE_API_BASE_URL}/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
  )

  if (!videoStatsResponse.ok) {
    throw new Error("Failed to fetch video statistics")
  }

  const videoStatsData = await videoStatsResponse.json()

  // Combine video data
  return videosData.items.map((item: any, index: number) => {
    const stats = videoStatsData.items[index]?.statistics || {}
    const contentDetails = videoStatsData.items[index]?.contentDetails || {}

    return {
      id: item.id.videoId,
      title: item.snippet.title,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.medium.url,
      statistics: stats,
      duration: contentDetails.duration,
    }
  })
}

// Helper to parse ISO 8601 duration to seconds
function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)

  const hours = match && match[1] ? Number.parseInt(match[1].replace("H", "")) : 0
  const minutes = match && match[2] ? Number.parseInt(match[2].replace("M", "")) : 0
  const seconds = match && match[3] ? Number.parseInt(match[3].replace("S", "")) : 0

  return hours * 3600 + minutes * 60 + seconds
}

// Calculate average engagement metrics from recent videos
function calculateAverageMetrics(videos: any[]) {
  if (!videos || videos.length === 0) {
    return {
      avgLikes: 0,
      avgComments: 0,
      avgViews: 0,
      avgDuration: 0,
      estimatedWatchTime: 0,
      estimatedShares: 0,
      estimatedSubscribersGained: 0,
    }
  }

  const totalVideos = videos.length

  const totalLikes = videos.reduce((sum, video) => sum + Number.parseInt(video.statistics.likeCount || "0"), 0)

  const totalComments = videos.reduce((sum, video) => sum + Number.parseInt(video.statistics.commentCount || "0"), 0)

  const totalViews = videos.reduce((sum, video) => sum + Number.parseInt(video.statistics.viewCount || "0"), 0)

  const totalDuration = videos.reduce((sum, video) => sum + parseDuration(video.duration || "PT0S"), 0)

  // Calculate averages
  const avgLikes = Math.round(totalLikes / totalVideos)
  const avgComments = Math.round(totalComments / totalVideos)
  const avgViews = Math.round(totalViews / totalVideos)
  const avgDuration = Math.round(totalDuration / totalVideos)

  // Estimate metrics that aren't directly available from the API
  // These are rough estimates based on industry averages
  const estimatedWatchTime = Math.round(avgDuration * 0.4) // Assume 40% retention
  const estimatedShares = Math.round(avgLikes * 0.05) // Shares are typically ~5% of likes
  const estimatedSubscribersGained = Math.round(avgViews * 0.002) // ~0.2% of viewers subscribe

  return {
    avgLikes,
    avgComments,
    avgViews,
    avgDuration,
    estimatedWatchTime,
    estimatedShares,
    estimatedSubscribersGained,
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const channelUrl = searchParams.get("url")

  if (!channelUrl) {
    return NextResponse.json({ error: "Channel URL is required" }, { status: 400 })
  }

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: "YouTube API key is not configured" }, { status: 500 })
  }

  try {
    // Extract channel ID from URL
    const channelIdentifier = extractChannelId(channelUrl)

    if (!channelIdentifier) {
      return NextResponse.json({ error: "Invalid YouTube channel URL" }, { status: 400 })
    }

    // Fetch channel data
    const channelData = await fetchChannelData(channelIdentifier)
    const channelId = channelData.id
    const channelStats = channelData.statistics

    // Fetch recent videos to calculate average engagement
    const recentVideos = await fetchRecentVideos(channelId)
    const averageMetrics = calculateAverageMetrics(recentVideos)

    // Prepare response data
    const responseData = {
      channelId: channelId,
      title: channelData.snippet.title,
      thumbnail: channelData.snippet.thumbnails?.default?.url,
      statistics: {
        subscribers: Number.parseInt(channelStats.subscriberCount || "0"),
        totalViews: Number.parseInt(channelStats.viewCount || "0"),
        totalVideos: Number.parseInt(channelStats.videoCount || "0"),
      },
      engagement: {
        views: averageMetrics.avgViews,
        likes: averageMetrics.avgLikes,
        comments: averageMetrics.avgComments,
        shares: averageMetrics.estimatedShares,
        watchTime: averageMetrics.estimatedWatchTime,
        videoDuration: averageMetrics.avgDuration,
        subscribersGained: averageMetrics.estimatedSubscribersGained,
      },
      recentVideos: recentVideos.map((video) => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        views: Number.parseInt(video.statistics.viewCount || "0"),
        likes: Number.parseInt(video.statistics.likeCount || "0"),
        comments: Number.parseInt(video.statistics.commentCount || "0"),
      })),
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error("YouTube API error:", error)

    return NextResponse.json({ error: error.message || "Failed to fetch YouTube data" }, { status: 500 })
  }
}

