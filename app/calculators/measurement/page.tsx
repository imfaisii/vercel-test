import { getCategoryData } from "@/lib/calculator-data"
import TemplateCategoryPage from "@/app/calculators/template-category-page"

export const metadata = {
  title: "Measurement Calculators | Calculator Directory",
  description: "Unit conversion and measurement tools",
}

export default function MeasurementPage() {
  const categoryData = getCategoryData("measurement")

  if (!categoryData) {
    return <div>Category not found</div>
  }

  return <TemplateCategoryPage category={categoryData} />
}

