import { getCategoryData } from "@/lib/calculator-data"
import TemplateCategoryPage from "@/app/calculators/template-category-page"

export const metadata = {
  title: "Date Calculators | Calculator Directory",
  description: "Date calculation and planning tools",
}

export default function DatePage() {
  const categoryData = getCategoryData("date")

  if (!categoryData) {
    return <div>Category not found</div>
  }

  return <TemplateCategoryPage category={categoryData} />
}

