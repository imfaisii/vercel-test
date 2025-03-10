"use client"

import { useState, useEffect } from "react"
import { Calculator, HelpCircle, Info, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts"

// Function to calculate IRR
function calculateIRR(cashFlows: number[], maxIterations = 1000, tolerance = 0.00001): number {
  // IRR calculation requires at least one positive and one negative cash flow
  let hasPositive = false
  let hasNegative = false

  for (const flow of cashFlows) {
    if (flow > 0) hasPositive = true
    if (flow < 0) hasNegative = true
  }

  if (!hasPositive || !hasNegative) {
    return Number.NaN // IRR cannot be calculated without both positive and negative cash flows
  }

  // Initial guess rates
  let rate1 = 0.1 // 10%
  let rate2 = 0.2 // 20%

  let npv1 = calculateNPV(cashFlows, rate1)
  let npv2 = calculateNPV(cashFlows, rate2)

  for (let i = 0; i < maxIterations; i++) {
    if (Math.abs(npv1) < tolerance) {
      return rate1
    }

    if (Math.abs(npv2) < tolerance) {
      return rate2
    }

    if (Math.abs(rate1 - rate2) < tolerance) {
      return rate1
    }

    // Use secant method to find next guess
    const rate3 = rate2 - (npv2 * (rate2 - rate1)) / (npv2 - npv1)

    // Update for next iteration
    rate1 = rate2
    npv1 = npv2
    rate2 = rate3
    npv2 = calculateNPV(cashFlows, rate2)

    // Check for divergence
    if (rate2 < -0.999 || rate2 > 1000) {
      return Number.NaN
    }
  }

  return Number.NaN // Failed to converge
}

// Function to calculate NPV at a given discount rate
function calculateNPV(cashFlows: number[], rate: number): number {
  let npv = 0

  for (let i = 0; i < cashFlows.length; i++) {
    npv += cashFlows[i] / Math.pow(1 + rate, i)
  }

  return npv
}

// Function to calculate NPV for a range of rates
function calculateNPVCurve(
  cashFlows: number[],
  minRate = -0.5,
  maxRate = 1,
  steps = 50,
): { rate: number; npv: number }[] {
  const result = []
  const stepSize = (maxRate - minRate) / steps

  for (let i = 0; i <= steps; i++) {
    const rate = minRate + i * stepSize
    const npv = calculateNPV(cashFlows, rate)
    result.push({ rate: rate * 100, npv })
  }

  return result
}

// Function to format currency
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Function to format percentage
function formatPercentage(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Example presets
const presets = [
  {
    name: "Real Estate Investment",
    cashFlows: [-100000, 12000, 12500, 13000, 13500, 120000],
  },
  {
    name: "Business Expansion",
    cashFlows: [-250000, 50000, 75000, 100000, 125000],
  },
  {
    name: "Equipment Purchase",
    cashFlows: [-50000, 15000, 15000, 15000, 15000, 10000],
  },
]

export default function IRRCalculator() {
  const [cashFlows, setCashFlows] = useState<number[]>([-100000, 20000, 25000, 30000, 40000])
  const [irr, setIrr] = useState<number | null>(null)
  const [npvCurve, setNpvCurve] = useState<{ rate: number; npv: number }[]>([])
  const [activeTab, setActiveTab] = useState<string>("basic")
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false)
  const [selectedPreset, setSelectedPreset] = useState<string>("")

  // Calculate IRR when cash flows change
  useEffect(() => {
    const calculatedIRR = calculateIRR(cashFlows)
    setIrr(isNaN(calculatedIRR) ? null : calculatedIRR)

    // Calculate NPV curve for visualization
    setNpvCurve(calculateNPVCurve(cashFlows))
  }, [cashFlows])

  // Handle cash flow changes
  const handleCashFlowChange = (index: number, value: string) => {
    const newValue = value === "" ? 0 : Number(value)
    const newCashFlows = [...cashFlows]
    newCashFlows[index] = newValue
    setCashFlows(newCashFlows)
    setSelectedPreset("")
  }

  // Add a new cash flow
  const addCashFlow = () => {
    setCashFlows([...cashFlows, 0])
    setSelectedPreset("")
  }

  // Remove a cash flow
  const removeCashFlow = (index: number) => {
    if (cashFlows.length > 2) {
      const newCashFlows = [...cashFlows]
      newCashFlows.splice(index, 1)
      setCashFlows(newCashFlows)
      setSelectedPreset("")
    }
  }

  // Apply a preset
  const applyPreset = (presetName: string) => {
    const preset = presets.find((p) => p.name === presetName)
    if (preset) {
      setCashFlows([...preset.cashFlows])
      setSelectedPreset(presetName)
    }
  }

  // Prepare data for the cash flow chart
  const cashFlowChartData = cashFlows.map((flow, index) => ({
    period: index === 0 ? "Initial" : `Year ${index}`,
    value: flow,
    color: flow >= 0 ? "#4ade80" : "#f87171",
  }))

  // Prepare data for the cumulative cash flow chart
  const cumulativeCashFlowData = cashFlows.reduce(
    (acc, flow, index) => {
      const previousValue = index > 0 ? acc[index - 1].cumulative : 0
      acc.push({
        period: index === 0 ? "Initial" : `Year ${index}`,
        cumulative: previousValue + flow,
      })
      return acc
    },
    [] as { period: string; cumulative: number }[],
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Internal Rate of Return (IRR) Calculator</CardTitle>
            <CardDescription>Calculate the IRR for your investment project</CardDescription>
          </div>
          <Calculator className="h-8 w-8 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="initialInvestment">
                    Initial Investment
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 ml-1 inline text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">The initial cash outflow (negative value) required for the investment.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="presets">Presets:</Label>
                    <select
                      id="presets"
                      className="p-2 border rounded-md"
                      value={selectedPreset}
                      onChange={(e) => applyPreset(e.target.value)}
                    >
                      <option value="">Select a preset</option>
                      {presets.map((preset, index) => (
                        <option key={index} value={preset.name}>
                          {preset.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    id="initialInvestment"
                    type="number"
                    value={cashFlows[0] === 0 ? "" : Math.abs(cashFlows[0])}
                    onChange={(e) =>
                      handleCashFlowChange(0, e.target.value === "" ? "0" : `-${Math.abs(Number(e.target.value))}`)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>
                  Cash Flows
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 ml-1 inline text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80">
                          The expected cash inflows (positive values) or outflows (negative values) for each period.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="space-y-2">
                  {cashFlows.slice(1).map((flow, index) => (
                    <div key={index + 1} className="flex items-center space-x-2">
                      <Label htmlFor={`cashFlow${index + 1}`} className="w-20">
                        Year {index + 1}
                      </Label>
                      <Input
                        id={`cashFlow${index + 1}`}
                        type="number"
                        value={flow === 0 ? "" : flow}
                        onChange={(e) => handleCashFlowChange(index + 1, e.target.value)}
                        className="flex-1"
                      />
                      {cashFlows.length > 2 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeCashFlow(index + 1)}
                          aria-label={`Remove Year ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addCashFlow} className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" /> Add Year
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Internal Rate of Return (IRR)</h3>
                  <p className="text-sm text-muted-foreground">The discount rate that makes the NPV equal to zero</p>
                </div>
                <div className="text-3xl font-bold text-primary">{irr !== null ? formatPercentage(irr) : "N/A"}</div>
              </div>
            </div>

            <div className="h-80">
              <h3 className="text-lg font-medium mb-2">Cash Flow Visualization</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
                  <YAxis />
                  <RechartsTooltip
                    formatter={(value: number) => [formatCurrency(value), "Cash Flow"]}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Bar dataKey="value" name="Cash Flow" fill={(entry) => entry.color} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="advancedInitialInvestment">
                    Initial Investment
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 ml-1 inline text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-80">The initial cash outflow (negative value) required for the investment.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    id="advancedInitialInvestment"
                    type="number"
                    value={cashFlows[0] === 0 ? "" : Math.abs(cashFlows[0])}
                    onChange={(e) =>
                      handleCashFlowChange(0, e.target.value === "" ? "0" : `-${Math.abs(Number(e.target.value))}`)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>
                  Cash Flows
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 ml-1 inline text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-80">
                          The expected cash inflows (positive values) or outflows (negative values) for each period.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="space-y-2">
                  {cashFlows.slice(1).map((flow, index) => (
                    <div key={index + 1} className="flex items-center space-x-2">
                      <Label htmlFor={`advancedCashFlow${index + 1}`} className="w-20">
                        Year {index + 1}
                      </Label>
                      <Input
                        id={`advancedCashFlow${index + 1}`}
                        type="number"
                        value={flow === 0 ? "" : flow}
                        onChange={(e) => handleCashFlowChange(index + 1, e.target.value)}
                        className="flex-1"
                      />
                      {cashFlows.length > 2 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeCashFlow(index + 1)}
                          aria-label={`Remove Year ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addCashFlow} className="w-full mt-2">
                    <Plus className="h-4 w-4 mr-2" /> Add Year
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Internal Rate of Return (IRR)</h3>
                    <p className="text-sm text-muted-foreground">The discount rate that makes the NPV equal to zero</p>
                  </div>
                  <div className="text-3xl font-bold text-primary">{irr !== null ? formatPercentage(irr) : "N/A"}</div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Total Investment</h3>
                    <p className="text-sm text-muted-foreground">Sum of all negative cash flows</p>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(cashFlows.filter((flow) => flow < 0).reduce((sum, flow) => sum + flow, 0) * -1)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-80">
                <h3 className="text-lg font-medium mb-2">Cash Flow Visualization</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cashFlowChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value: number) => [formatCurrency(value), "Cash Flow"]}
                      labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Bar dataKey="value" name="Cash Flow" fill={(entry) => entry.color} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80">
                <h3 className="text-lg font-medium mb-2">Cumulative Cash Flow</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cumulativeCashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
                    <YAxis />
                    <RechartsTooltip
                      formatter={(value: number) => [formatCurrency(value), "Cumulative Cash Flow"]}
                      labelFormatter={(label) => `Period: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      name="Cumulative Cash Flow"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="h-80">
              <h3 className="text-lg font-medium mb-2">NPV vs Discount Rate</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={npvCurve} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="rate"
                    label={{ value: "Discount Rate (%)", position: "insideBottomRight", offset: -10 }}
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                  />
                  <YAxis
                    label={{ value: "NPV", angle: -90, position: "insideLeft" }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [formatCurrency(value), "NPV"]}
                    labelFormatter={(label) => `Discount Rate: ${label.toFixed(2)}%`}
                  />
                  <Line type="monotone" dataKey="npv" name="NPV" stroke="#2563eb" dot={false} strokeWidth={2} />
                  {/* Add a reference line at NPV = 0 */}
                  <RechartsTooltip />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="about-irr">
            <AccordionTrigger>
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-2" />
                About Internal Rate of Return (IRR)
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 text-sm">
                <p>
                  The Internal Rate of Return (IRR) is a financial metric used to estimate the profitability of
                  potential investments. It is the discount rate that makes the net present value (NPV) of all cash
                  flows equal to zero.
                </p>
                <p>
                  <strong>How to interpret IRR:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Higher IRR indicates a more attractive investment.</li>
                  <li>
                    If IRR is greater than the required rate of return (hurdle rate), the investment may be worthwhile.
                  </li>
                  <li>If IRR is less than the hurdle rate, the investment may not be financially viable.</li>
                </ul>
                <p>
                  <strong>Limitations of IRR:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Assumes all cash flows can be reinvested at the IRR rate.</li>
                  <li>May give misleading results when comparing mutually exclusive projects.</li>
                  <li>Can produce multiple IRR values when cash flows change sign more than once.</li>
                </ul>
                <p>
                  <strong>Formula:</strong> IRR is the rate (r) that satisfies:
                </p>
                <div className="bg-muted p-2 rounded">
                  <code>NPV = CF₀ + CF₁/(1+r)¹ + CF₂/(1+r)² + ... + CFₙ/(1+r)ⁿ = 0</code>
                </div>
                <p>Where CF₀, CF₁, CF₂, ..., CFₙ are the cash flows at each period.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Use this calculator to evaluate the potential return of your investments.
        </p>
      </CardFooter>
    </Card>
  )
}

