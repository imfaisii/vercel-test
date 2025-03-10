import { getCategoryData } from "@/lib/calculator-data"
import TemplateCategoryPage from "@/app/calculators/template-category-page"

export const metadata = {
  title: "Cryptocurrency Calculators",
  description: "Cryptocurrency calculation and analysis tools",
}

export default function CryptoPage() {
  const categoryData = getCategoryData("crypto")

  if (!categoryData) {
    return <div>Category not found</div>
  }

  return <TemplateCategoryPage category={categoryData} />
}

