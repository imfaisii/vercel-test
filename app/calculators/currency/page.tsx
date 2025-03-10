import { getCategoryData } from "@/lib/calculator-data"
import TemplateCategoryPage from "../template-category-page"

export default function CurrencyCalculatorsPage() {
  const categoryData = getCategoryData("currency")

  if (!categoryData) {
    return <div>Category not found</div>
  }

  return <TemplateCategoryPage category={categoryData} />
}

