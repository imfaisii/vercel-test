import { Breadcrumb } from "@/components/breadcrumb"
import { FormulaExplorerPage } from "@/components/math-formula-game/formula-explorer-page"

export const metadata = {
  title: "Math Formula Library | Interactive Learning Tool",
  description:
    "Explore and learn essential math formulas with our interactive library. From algebra to calculus, master mathematical concepts with visual examples.",
}

export default function MathFormulasPage() {
  const breadcrumbItems = [
    {
      label: "Math Formula Library",
      href: "/math-formulas",
      current: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      <FormulaExplorerPage />
    </div>
  )
}

