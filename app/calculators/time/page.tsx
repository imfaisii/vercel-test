import { getCategoryData } from "@/lib/calculator-data"
import { notFound } from "next/navigation"
import TemplateCategoryPage from "@/app/calculators/template-category-page"

export const metadata = {
  title: "Time Calculators | Calculator Directory",
  description: "Time calculation and conversion tools",
}

export default function TimePage() {
  const categoryData = getCategoryData("time")

  if (!categoryData) {
    notFound()
  }

  return <TemplateCategoryPage category={categoryData} />
}

