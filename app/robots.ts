import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  // Hardcode the base URL to ensure it's always correct
  const baseUrl = "https://freecalculators.ai"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

