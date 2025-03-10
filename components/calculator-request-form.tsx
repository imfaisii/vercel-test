"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { categories } from "@/lib/calculator-data"
import { CheckCircle2 } from "lucide-react"

export default function CalculatorRequestForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [useCase, setUseCase] = useState("")
  const [additionalDetails, setAdditionalDetails] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email address"
    if (!category) newErrors.category = "Please select a category"
    if (!description.trim()) newErrors.description = "Description is required"
    if (!useCase.trim()) newErrors.useCase = "Use case is required"

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
        title: "Request submitted",
        description: "Thank you for your calculator suggestion! We'll review it soon.",
      })
    }, 1500)
  }

  const resetForm = () => {
    setName("")
    setEmail("")
    setCategory("")
    setDescription("")
    setUseCase("")
    setAdditionalDetails("")
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
          Your calculator request has been submitted successfully. We'll review it and may add it to our collection
          soon!
        </p>
        <Button onClick={resetForm}>Submit Another Request</Button>
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
        <Label htmlFor="category">Calculator Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.title}
              </SelectItem>
            ))}
            <SelectItem value="other">Other (Please specify in description)</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Calculator Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the calculator you'd like us to create..."
          className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="useCase">Use Case</Label>
        <Textarea
          id="useCase"
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          placeholder="How would you use this calculator? What problem would it solve for you?"
          className={`min-h-[100px] ${errors.useCase ? "border-red-500" : ""}`}
        />
        {errors.useCase && <p className="text-sm text-red-500">{errors.useCase}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalDetails">Additional Details (Optional)</Label>
        <Textarea
          id="additionalDetails"
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          placeholder="Any additional information, formula details, or specific features you'd like to see..."
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Calculator Request"}
      </Button>
    </form>
  )
}

