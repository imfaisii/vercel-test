"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0")
  const [memory, setMemory] = useState<number | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [pendingOperator, setPendingOperator] = useState<string | null>(null)
  const [stackValue, setStackValue] = useState<number | null>(null)
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg")
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  // Convert degrees to radians if needed
  const toRadians = (value: number) => {
    return angleMode === "deg" ? (value * Math.PI) / 180 : value
  }

  // Convert radians to degrees if needed
  const fromRadians = (value: number) => {
    return angleMode === "deg" ? (value * 180) / Math.PI : value
  }

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.")
      setWaitingForOperand(false)
      return
    }

    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const clearDisplay = () => {
    setDisplay("0")
    setWaitingForOperand(false)
  }

  const clearAll = () => {
    setDisplay("0")
    setWaitingForOperand(false)
    setPendingOperator(null)
    setStackValue(null)
  }

  const toggleSign = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(-value))
  }

  const inputPercent = () => {
    const value = Number.parseFloat(display)
    setDisplay(String(value / 100))
  }

  const performOperation = (operator: string) => {
    const operand = Number.parseFloat(display)

    if (stackValue === null) {
      setStackValue(operand)
    } else if (pendingOperator) {
      const result = calculate(stackValue, operand, pendingOperator)
      setStackValue(result)
      setDisplay(String(result))

      // Add to history
      setHistory([...history, `${stackValue} ${pendingOperator} ${operand} = ${result}`])
    }

    setWaitingForOperand(true)
    setPendingOperator(operator)
  }

  const calculate = (firstOperand: number, secondOperand: number, operator: string): number => {
    switch (operator) {
      case "+":
        return firstOperand + secondOperand
      case "-":
        return firstOperand - secondOperand
      case "×":
        return firstOperand * secondOperand
      case "÷":
        return firstOperand / secondOperand
      case "^":
        return Math.pow(firstOperand, secondOperand)
      case "yroot":
        return Math.pow(firstOperand, 1 / secondOperand)
      default:
        return secondOperand
    }
  }

  const calculateResult = () => {
    if (stackValue === null || pendingOperator === null) {
      return
    }

    const operand = Number.parseFloat(display)
    const result = calculate(stackValue, operand, pendingOperator)

    // Add to history
    setHistory([...history, `${stackValue} ${pendingOperator} ${operand} = ${result}`])

    setDisplay(String(result))
    setStackValue(null)
    setPendingOperator(null)
    setWaitingForOperand(true)
  }

  const performUnaryOperation = (operation: string) => {
    const operand = Number.parseFloat(display)
    let result: number

    switch (operation) {
      case "sqrt":
        result = Math.sqrt(operand)
        break
      case "square":
        result = Math.pow(operand, 2)
        break
      case "cube":
        result = Math.pow(operand, 3)
        break
      case "1/x":
        result = 1 / operand
        break
      case "sin":
        result = Math.sin(toRadians(operand))
        break
      case "cos":
        result = Math.cos(toRadians(operand))
        break
      case "tan":
        result = Math.tan(toRadians(operand))
        break
      case "asin":
        result = fromRadians(Math.asin(operand))
        break
      case "acos":
        result = fromRadians(Math.acos(operand))
        break
      case "atan":
        result = fromRadians(Math.atan(operand))
        break
      case "ln":
        result = Math.log(operand)
        break
      case "log":
        result = Math.log10(operand)
        break
      case "exp":
        result = Math.exp(operand)
        break
      case "factorial":
        result = factorial(operand)
        break
      default:
        result = operand
    }

    // Add to history
    setHistory([...history, `${operation}(${operand}) = ${result}`])

    setDisplay(String(result))
    setWaitingForOperand(true)
  }

  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1
    if (!Number.isInteger(n) || n < 0) return Number.NaN
    let result = 1
    for (let i = 2; i <= n; i++) {
      result *= i
    }
    return result
  }

  const memoryStore = () => {
    setMemory(Number.parseFloat(display))
  }

  const memoryRecall = () => {
    if (memory !== null) {
      setDisplay(String(memory))
      setWaitingForOperand(true)
    }
  }

  const memoryClear = () => {
    setMemory(null)
  }

  const memoryAdd = () => {
    if (memory === null) {
      memoryStore()
    } else {
      setMemory(memory + Number.parseFloat(display))
    }
    setWaitingForOperand(true)
  }

  const memorySubtract = () => {
    if (memory === null) {
      setMemory(-Number.parseFloat(display))
    } else {
      setMemory(memory - Number.parseFloat(display))
    }
    setWaitingForOperand(true)
  }

  const inputConstant = (constant: string) => {
    switch (constant) {
      case "pi":
        setDisplay(String(Math.PI))
        break
      case "e":
        setDisplay(String(Math.E))
        break
      default:
        break
    }
    setWaitingForOperand(true)
  }

  const toggleAngleMode = () => {
    setAngleMode(angleMode === "deg" ? "rad" : "deg")
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <Card className="p-4">
            <div className="bg-muted p-4 rounded-md mb-4 text-right">
              <div className="text-xs text-muted-foreground mb-1">
                {angleMode.toUpperCase()} | {memory !== null ? "M" : ""}
              </div>
              <div className="text-2xl font-medium truncate">{display}</div>
            </div>

            <div className="grid grid-cols-5 gap-1">
              {/* Memory functions */}
              <Button variant="outline" onClick={memoryClear} className="text-xs">
                MC
              </Button>
              <Button variant="outline" onClick={memoryRecall} className="text-xs">
                MR
              </Button>
              <Button variant="outline" onClick={memoryAdd} className="text-xs">
                M+
              </Button>
              <Button variant="outline" onClick={memorySubtract} className="text-xs">
                M-
              </Button>
              <Button variant="outline" onClick={memoryStore} className="text-xs">
                MS
              </Button>

              {/* Scientific functions - Row 1 */}
              <Button variant="outline" onClick={() => performUnaryOperation("factorial")} className="text-xs">
                x!
              </Button>
              <Button variant="outline" onClick={() => inputConstant("pi")} className="text-xs">
                π
              </Button>
              <Button variant="outline" onClick={() => inputConstant("e")} className="text-xs">
                e
              </Button>
              <Button variant="outline" onClick={clearAll} className="text-xs">
                AC
              </Button>
              <Button variant="outline" onClick={clearDisplay} className="text-xs">
                C
              </Button>

              {/* Scientific functions - Row 2 */}
              <Button variant="outline" onClick={() => performUnaryOperation("sin")} className="text-xs">
                sin
              </Button>
              <Button variant="outline" onClick={() => performUnaryOperation("cos")} className="text-xs">
                cos
              </Button>
              <Button variant="outline" onClick={() => performUnaryOperation("tan")} className="text-xs">
                tan
              </Button>
              <Button variant="outline" onClick={toggleSign} className="text-xs">
                ±
              </Button>
              <Button variant="outline" onClick={inputPercent} className="text-xs">
                %
              </Button>

              {/* Scientific functions - Row 3 */}
              <Button variant="outline" onClick={() => performUnaryOperation("asin")} className="text-xs">
                sin⁻¹
              </Button>
              <Button variant="outline" onClick={() => performUnaryOperation("acos")} className="text-xs">
                cos⁻¹
              </Button>
              <Button variant="outline" onClick={() => performUnaryOperation("atan")} className="text-xs">
                tan⁻¹
              </Button>
              <Button variant="outline" onClick={() => performOperation("^")} className="text-xs">
                x^y
              </Button>
              <Button variant="outline" onClick={() => performOperation("yroot")} className="text-xs">
                y√x
              </Button>

              {/* Scientific functions - Row 4 */}
              <Button variant="outline" onClick={() => performUnaryOperation("ln")} className="text-xs">
                ln
              </Button>
              <Button variant="outline" onClick={() => performUnaryOperation("log")} className="text-xs">
                log
              </Button>
              <Button variant="outline" onClick={() => performUnaryOperation("exp")} className="text-xs">
                exp
              </Button>
              <Button variant="outline" onClick={() => performUnaryOperation("square")} className="text-xs">
                x²
              </Button>
              <Button variant="outline" onClick={() => performUnaryOperation("cube")} className="text-xs">
                x³
              </Button>

              {/* Scientific functions - Row 5 */}
              <Button variant="outline" onClick={toggleAngleMode} className="text-xs">
                {angleMode}
              </Button>
              <Button variant="outline" onClick={() => performUnaryOperation("sqrt")} className="text-xs">
                √
              </Button>
              <Button variant="outline" onClick={() => performUnaryOperation("1/x")} className="text-xs">
                1/x
              </Button>
              <Button variant="outline" onClick={() => inputDigit("(")} className="text-xs">
                (
              </Button>
              <Button variant="outline" onClick={() => inputDigit(")")} className="text-xs">
                )
              </Button>

              {/* Number pad and basic operations */}
              <Button variant="outline" onClick={() => inputDigit("7")}>
                7
              </Button>
              <Button variant="outline" onClick={() => inputDigit("8")}>
                8
              </Button>
              <Button variant="outline" onClick={() => inputDigit("9")}>
                9
              </Button>
              <Button
                variant="outline"
                onClick={() => performOperation("÷")}
                className="bg-amber-100 hover:bg-amber-200"
              >
                ÷
              </Button>
              <Button
                variant="outline"
                onClick={() => performOperation("^")}
                className="bg-amber-100 hover:bg-amber-200"
              >
                ^
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
              <Button
                variant="outline"
                onClick={() => performOperation("×")}
                className="bg-amber-100 hover:bg-amber-200"
              >
                ×
              </Button>
              <Button
                variant="outline"
                onClick={() => performUnaryOperation("sqrt")}
                className="bg-amber-100 hover:bg-amber-200"
              >
                √
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
              <Button
                variant="outline"
                onClick={() => performOperation("-")}
                className="bg-amber-100 hover:bg-amber-200"
              >
                −
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
              <Button
                variant="outline"
                onClick={() => performOperation("+")}
                className="bg-amber-100 hover:bg-amber-200"
              >
                +
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-4">
            <div className="max-h-[400px] overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No calculation history yet</p>
              ) : (
                <ul className="space-y-2">
                  {history.map((item, index) => (
                    <li key={index} className="p-2 border-b text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {history.length > 0 && (
              <Button variant="outline" className="w-full mt-4" onClick={() => setHistory([])}>
                Clear History
              </Button>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

