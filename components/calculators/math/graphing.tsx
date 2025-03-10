"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X, Plus, RefreshCw, Download, Trash } from "lucide-react"

// Function parser and evaluator
function evaluateExpression(expression: string, x: number): number {
  // Replace common mathematical functions and constants
  const preparedExpression = expression
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/sqrt\(/g, "Math.sqrt(")
    .replace(/log\(/g, "Math.log10(")
    .replace(/ln\(/g, "Math.log(")
    .replace(/abs\(/g, "Math.abs(")
    .replace(/pi/g, "Math.PI")
    .replace(/e/g, "Math.E")
    .replace(/\^/g, "**")

  try {
    // eslint-disable-next-line no-new-func
    return Function("x", `"use strict"; return ${preparedExpression}`)(x)
  } catch (error) {
    console.error("Error evaluating expression:", error)
    return Number.NaN
  }
}

interface FunctionData {
  id: string
  expression: string
  color: string
  visible: boolean
}

export default function GraphingCalculator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [functions, setFunctions] = useState<FunctionData[]>([
    { id: "f1", expression: "x^2", color: "#3b82f6", visible: true },
  ])
  const [newFunction, setNewFunction] = useState("")
  const [xMin, setXMin] = useState(-10)
  const [xMax, setXMax] = useState(10)
  const [yMin, setYMin] = useState(-10)
  const [yMax, setYMax] = useState(10)
  const [gridSize, setGridSize] = useState(1)
  const [showGrid, setShowGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("graph")

  // Available colors for functions
  const colors = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#84cc16", // lime
  ]

  // Draw the graph
  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const width = canvas.width
    const height = canvas.height

    // Calculate scale factors
    const scaleX = width / (xMax - xMin)
    const scaleY = height / (yMax - yMin)

    // Function to convert x coordinate to canvas x
    const toCanvasX = (x: number) => (x - xMin) * scaleX

    // Function to convert y coordinate to canvas y
    const toCanvasY = (y: number) => height - (y - yMin) * scaleY

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 0.5

      // Draw vertical grid lines
      for (let x = Math.ceil(xMin / gridSize) * gridSize; x <= xMax; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(toCanvasX(x), 0)
        ctx.lineTo(toCanvasX(x), height)
        ctx.stroke()
      }

      // Draw horizontal grid lines
      for (let y = Math.ceil(yMin / gridSize) * gridSize; y <= yMax; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, toCanvasY(y))
        ctx.lineTo(width, toCanvasY(y))
        ctx.stroke()
      }
    }

    // Draw axes
    if (showAxes) {
      ctx.strokeStyle = "#6b7280"
      ctx.lineWidth = 1

      // Draw x-axis if it's in view
      if (yMin <= 0 && yMax >= 0) {
        ctx.beginPath()
        ctx.moveTo(0, toCanvasY(0))
        ctx.lineTo(width, toCanvasY(0))
        ctx.stroke()

        // Draw x-axis labels
        ctx.fillStyle = "#6b7280"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        for (let x = Math.ceil(xMin / gridSize) * gridSize; x <= xMax; x += gridSize) {
          if (x !== 0) {
            ctx.fillText(x.toString(), toCanvasX(x), toCanvasY(0) + 2)
          }
        }
      }

      // Draw y-axis if it's in view
      if (xMin <= 0 && xMax >= 0) {
        ctx.beginPath()
        ctx.moveTo(toCanvasX(0), 0)
        ctx.lineTo(toCanvasX(0), height)
        ctx.stroke()

        // Draw y-axis labels
        ctx.fillStyle = "#6b7280"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "right"
        ctx.textBaseline = "middle"
        for (let y = Math.ceil(yMin / gridSize) * gridSize; y <= yMax; y += gridSize) {
          if (y !== 0) {
            ctx.fillText(y.toString(), toCanvasX(0) - 2, toCanvasY(y))
          }
        }
      }

      // Draw origin label
      if (xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0) {
        ctx.fillStyle = "#6b7280"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "right"
        ctx.textBaseline = "top"
        ctx.fillText("0", toCanvasX(0) - 2, toCanvasY(0) + 2)
      }
    }

    // Draw functions
    functions.forEach((func) => {
      if (!func.visible) return

      ctx.strokeStyle = func.color
      ctx.lineWidth = 2
      ctx.beginPath()

      let isFirstPoint = true
      const step = (xMax - xMin) / width

      for (let pixelX = 0; pixelX <= width; pixelX++) {
        const x = xMin + (pixelX * (xMax - xMin)) / width
        try {
          const y = evaluateExpression(func.expression, x)

          if (!isNaN(y) && isFinite(y)) {
            const canvasY = toCanvasY(y)
            if (isFirstPoint) {
              ctx.moveTo(pixelX, canvasY)
              isFirstPoint = false
            } else {
              ctx.lineTo(pixelX, canvasY)
            }
          } else {
            isFirstPoint = true
          }
        } catch (e) {
          isFirstPoint = true
        }
      }

      ctx.stroke()
    })
  }

  // Add a new function
  const addFunction = () => {
    if (!newFunction.trim()) {
      setError("Please enter a function expression")
      return
    }

    try {
      // Test if the function can be evaluated
      evaluateExpression(newFunction, 0)

      // Find an unused color
      const usedColors = functions.map((f) => f.color)
      const availableColor = colors.find((c) => !usedColors.includes(c)) || colors[0]

      const newId = `f${functions.length + 1}`
      setFunctions([
        ...functions,
        {
          id: newId,
          expression: newFunction,
          color: availableColor,
          visible: true,
        },
      ])
      setNewFunction("")
      setError("")
    } catch (e) {
      setError("Invalid function expression")
    }
  }

  // Remove a function
  const removeFunction = (id: string) => {
    setFunctions(functions.filter((f) => f.id !== id))
  }

  // Toggle function visibility
  const toggleFunctionVisibility = (id: string) => {
    setFunctions(functions.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f)))
  }

  // Update function color
  const updateFunctionColor = (id: string, color: string) => {
    setFunctions(functions.map((f) => (f.id === id ? { ...f, color } : f)))
  }

  // Reset view to default
  const resetView = () => {
    setXMin(-10)
    setXMax(10)
    setYMin(-10)
    setYMax(10)
    setGridSize(1)
  }

  // Download graph as image
  const downloadGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "graph.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  // Clear all functions
  const clearFunctions = () => {
    setFunctions([])
  }

  // Update the graph when parameters change
  useEffect(() => {
    drawGraph()
  }, [functions, xMin, xMax, yMin, yMax, gridSize, showGrid, showAxes])

  // Resize canvas when window resizes
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const container = canvas.parentElement
      if (!container) return

      canvas.width = container.clientWidth
      canvas.height = 400
      drawGraph()
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="graph">Graph</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="graph">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="w-full h-[400px] bg-white rounded-md overflow-hidden">
                  <canvas ref={canvasRef} className="w-full h-full"></canvas>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="new-function">Add Function (use x as variable)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="new-function"
                    value={newFunction}
                    onChange={(e) => setNewFunction(e.target.value)}
                    placeholder="e.g., x^2, sin(x), 2*x+1"
                    className={error ? "border-red-500" : ""}
                  />
                  <Button onClick={addFunction}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <div className="space-y-2">
                <Label>Functions</Label>
                {functions.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No functions added yet</p>
                ) : (
                  <div className="space-y-2">
                    {functions.map((func) => (
                      <div key={func.id} className="flex items-center space-x-2 p-2 border rounded-md">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: func.color }}></div>
                        <Select value={func.color} onValueChange={(value) => updateFunctionColor(func.id, value)}>
                          <SelectTrigger className="w-20 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {colors.map((color) => (
                              <SelectItem key={color} value={color}>
                                <div className="flex items-center">
                                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                                  <span>{color.replace("#", "")}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="flex-1 font-mono text-sm">y = {func.expression}</span>
                        <div className="flex items-center space-x-2">
                          <Switch checked={func.visible} onCheckedChange={() => toggleFunctionVisibility(func.id)} />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFunction(func.id)}
                            className="h-8 w-8 text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={resetView}>
                  <RefreshCw className="h-4 w-4 mr-1" /> Reset View
                </Button>
                <Button variant="outline" onClick={downloadGraph}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
                <Button variant="outline" onClick={clearFunctions} className="text-red-500">
                  <Trash className="h-4 w-4 mr-1" /> Clear All
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="x-range">X-Axis Range</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="x-min"
                    type="number"
                    value={xMin}
                    onChange={(e) => setXMin(Number(e.target.value))}
                    className="w-20"
                  />
                  <span>to</span>
                  <Input
                    id="x-max"
                    type="number"
                    value={xMax}
                    onChange={(e) => setXMax(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="y-range">Y-Axis Range</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="y-min"
                    type="number"
                    value={yMin}
                    onChange={(e) => setYMin(Number(e.target.value))}
                    className="w-20"
                  />
                  <span>to</span>
                  <Input
                    id="y-max"
                    type="number"
                    value={yMax}
                    onChange={(e) => setYMax(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grid-size">Grid Size</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="grid-size"
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={[gridSize]}
                    onValueChange={(value) => setGridSize(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{gridSize}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
                  <Label htmlFor="show-grid">Show Grid</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="show-axes" checked={showAxes} onCheckedChange={setShowAxes} />
                  <Label htmlFor="show-axes">Show Axes</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

