"use client"

import React from "react"

interface CalculatorContextType {
  isLoading?: boolean
}

const CalculatorContext = React.createContext<CalculatorContextType>({})

interface CalculatorProps {
  children: React.ReactNode
  className?: string
}

export function Calculator({ children, className = "" }: CalculatorProps) {
  return (
    <CalculatorContext.Provider value={{}}>
      <div className={`grid gap-8 md:grid-cols-2 ${className}`}>{children}</div>
    </CalculatorContext.Provider>
  )
}

interface CalculatorInputProps {
  children: React.ReactNode
  className?: string
}

Calculator.Input = function CalculatorInput({ children, className = "" }: CalculatorInputProps) {
  return <div className={`space-y-4 ${className}`}>{children}</div>
}

interface CalculatorOutputProps {
  children: React.ReactNode
  className?: string
}

Calculator.Output = function CalculatorOutput({ children, className = "" }: CalculatorOutputProps) {
  return <div className={`space-y-4 ${className}`}>{children}</div>
}

