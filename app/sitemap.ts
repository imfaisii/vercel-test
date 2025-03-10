import type { MetadataRoute } from "next"
import { categories } from "@/lib/calculator-data"

export default function sitemap(): MetadataRoute.Sitemap {
  // Hardcode the base URL to ensure it's always correct
  const baseUrl = "https://freecalculators.ai"

  // Current date for lastModified
  const date = new Date()

  // Start with main pages
  const entries = [
    {
      url: baseUrl,
      lastModified: date,
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/request-calculator`,
      lastModified: date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: date,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: date,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: date,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
  ]

  // Add category pages
  for (const category of categories) {
    entries.push({
      url: `${baseUrl}/calculators/${category.slug}`,
      lastModified: date,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })

    // Add individual calculator pages for this category
    for (const calculator of category.calculators) {
      entries.push({
        url: `${baseUrl}/calculators/${category.slug}/${calculator.slug}`,
        lastModified: date,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      })
    }
  }

  return entries
}

