import type { Metadata } from "next"
import FeedbackForm from "@/components/feedback-form"
import { Breadcrumb } from "@/components/breadcrumb"

export const metadata: Metadata = {
  title: "Contact Us | Free Calculators",
  description:
    "Get in touch with the Free Calculators team. We'd love to hear your feedback, suggestions, or questions.",
}

export default function ContactPage() {
  const breadcrumbItems = [
    {
      label: "Contact Us",
      href: "/contact",
      current: true,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Breadcrumb items={breadcrumbItems} />

      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

      <div className="mb-8">
        <p className="text-lg mb-4">
          We'd love to hear from you! Whether you have a question, suggestion, or just want to say hello, feel free to
          drop us a line using the form below.
        </p>
        <p className="mb-4">
          Our team is dedicated to providing the best calculator tools for your needs. Your feedback helps us improve
          and add new features.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <FeedbackForm />
      </div>
    </div>
  )
}

