"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { categories } from "@/lib/calculator-data"
import { CheckCircle2 } from "lucide-react"

type FeedbackType = "error" | "suggestion" | "question"

export default function FeedbackForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("suggestion")
  const [category, setCategory] = useState("")
  const [calculator, setCalculator] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { toast } = useToast()

  // Get calculators for the selected category
  const getCalculatorsForCategory = () => {
    const selectedCategory = categories.find((cat) => cat.slug === category)
    return selectedCategory ? selectedCategory.calculators : []
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email address"

    if (feedbackType === "error") {
      if (!category) newErrors.category = "Please select a category for the error report"
      if (!calculator) newErrors.calculator = "Please select which calculator has the issue"
    }

    if (!message.trim()) newErrors.message = "Please provide details about your feedback"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback! We appreciate your input.",
      })
    }, 1500)
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setFeedbackType("suggestion")
    setCategory("")
    setCalculator("")
    setMessage("")
    setIsSubmitted(false)
    setErrors({})
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Your feedback has been submitted successfully. We appreciate your input and will use it to improve our
          calculators and website.
        </p>
        <Button onClick={resetForm}>Submit More Feedback</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Feedback Type</Label>
        <RadioGroup
          value={feedbackType}
          onValueChange={(value) => setFeedbackType(value as FeedbackType)}
          className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="error" id="error" />
            <Label htmlFor="error" className="cursor-pointer">
              Report an Error
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="suggestion" id="suggestion" />
            <Label htmlFor="suggestion" className="cursor-pointer">
              Suggestion
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="question" id="question" />
            <Label htmlFor="question" className="cursor-pointer">
              Question
            </Label>
          </div>
        </RadioGroup>
      </div>

      {feedbackType === "error" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Calculator Category</Label>
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value)
                setCalculator("") // Reset calculator when category changes
              }}
            >
              <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="calculator">Specific Calculator</Label>
            <Select value={calculator} onValueChange={setCalculator} disabled={!category}>
              <SelectTrigger id="calculator" className={errors.calculator ? "border-red-500" : ""}>
                <SelectValue placeholder={category ? "Select a calculator" : "Select a category first"} />
              </SelectTrigger>
              <SelectContent>
                {getCalculatorsForCategory().map((calc) => (
                  <SelectItem key={calc.slug} value={calc.slug}>
                    {calc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.calculator && <p className="text-sm text-red-500">{errors.calculator}</p>}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="message">
          {feedbackType === "error"
            ? "Describe the Issue"
            : feedbackType === "suggestion"
              ? "Your Suggestion"
              : "Your Question"}
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            feedbackType === "error"
              ? "Please describe what went wrong and steps to reproduce the issue..."
              : feedbackType === "suggestion"
                ? "Share your ideas on how we can improve our calculators or website..."
                : "What would you like to know about our calculators or services?"
          }
          className={`min-h-[150px] ${errors.message ? "border-red-500" : ""}`}
        />
        {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  )
}

