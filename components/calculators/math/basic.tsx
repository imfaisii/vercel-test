"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function BasicCalculator() {
  const [display, setDisplay] = useState("0")
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit)
      setWaitingForSecondOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.")
      setWaitingForSecondOperand(false)
      return
    }

    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const clearDisplay = () => {
    setDisplay("0")
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const handleOperator = (nextOperator: string) => {
    const inputValue = Number.parseFloat(display)

    if (firstOperand === null) {
      setFirstOperand(inputValue)
    } else if (operator) {
      const result = performCalculation(operator, firstOperand, inputValue)
      setDisplay(String(result))
      setFirstOperand(result)
    }

    setWaitingForSecondOperand(true)
    setOperator(nextOperator)
  }

  const performCalculation = (op: string, first: number, second: number): number => {
    switch (op) {
      case "+":
        return first + second
      case "-":
        return first - second
      case "*":
        return first * second
      case "/":
        return first / second
      default:
        return second
    }
  }

  const calculateResult = () => {
    if (firstOperand === null || operator === null) {
      return
    }

    const inputValue = Number.parseFloat(display)
    const result = performCalculation(operator, firstOperand, inputValue)
    setDisplay(String(result))
    setFirstOperand(result)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-muted p-4 rounded-md mb-4 text-right">
        <div className="text-3xl font-medium truncate">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Button variant="outline" onClick={clearDisplay} className="col-span-2">
          Clear
        </Button>
        <Button variant="outline" onClick={() => handleOperator("/")} className="bg-amber-100 hover:bg-amber-200">
          ÷
        </Button>
        <Button variant="outline" onClick={() => handleOperator("*")} className="bg-amber-100 hover:bg-amber-200">
          ×
        </Button>

        <Button variant="outline" onClick={() => inputDigit("7")}>
          7
        </Button>
        <Button variant="outline" onClick={() => inputDigit("8")}>
          8
        </Button>
        <Button variant="outline" onClick={() => inputDigit("9")}>
          9
        </Button>
        <Button variant="outline" onClick={() => handleOperator("-")} className="bg-amber-100 hover:bg-amber-200">
          −
        </Button>

        <Button variant="outline" onClick={() => inputDigit("4")}>
          4
        </Button>
        <Button variant="outline" onClick={() => inputDigit("5")}>
          5
        </Button>
        <Button variant="outline" onClick={() => inputDigit("6")}>
          6
        </Button>
        <Button variant="outline" onClick={() => handleOperator("+")} className="bg-amber-100 hover:bg-amber-200">
          +
        </Button>

        <Button variant="outline" onClick={() => inputDigit("1")}>
          1
        </Button>
        <Button variant="outline" onClick={() => inputDigit("2")}>
          2
        </Button>
        <Button variant="outline" onClick={() => inputDigit("3")}>
          3
        </Button>
        <Button variant="outline" onClick={calculateResult} className="bg-blue-100 hover:bg-blue-200 row-span-2">
          =
        </Button>

        <Button variant="outline" onClick={() => inputDigit("0")} className="col-span-2">
          0
        </Button>
        <Button variant="outline" onClick={inputDecimal}>
          .
        </Button>
      </div>
    </div>
  )
}

