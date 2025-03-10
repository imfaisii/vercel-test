"use client"

import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContextValue {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue | undefined>(undefined)

function useChartContext() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChartContext must be used within a ChartProvider")
  }
  return context
}

interface ChartContainerProps {
  config: ChartConfig
  children: React.ReactNode
  className?: string
}

export function ChartContainer({ config, children, className }: ChartContainerProps) {
  // Create CSS variables for each color
  React.useEffect(() => {
    const root = document.documentElement
    Object.entries(config).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value.color)
    })

    return () => {
      Object.keys(config).forEach((key) => {
        root.style.removeProperty(`--color-${key}`)
      })
    }
  }, [config])

  return (
    <ChartContext.Provider value={{ config }}>
      <div className={className}>{children}</div>
    </ChartContext.Provider>
  )
}

interface ChartTooltipProps {
  content: React.ReactNode
  className?: string
}

export function ChartTooltip({ content, className }: ChartTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={className} />
        </TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface ChartTooltipContentProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    dataKey: string
  }>
  label?: string
  formatter?: (value: number) => string
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter = (value) => value.toString(),
}: ChartTooltipContentProps) {
  const { config } = useChartContext()

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium">Year {label}</div>
        </div>
        <div className="grid gap-1">
          {payload.map((item) => {
            const dataKey = item.dataKey as string
            const configItem = config[dataKey]

            // Skip if no config item or value is null
            if (!configItem || item.value === null) return null

            return (
              <div key={item.dataKey} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full" style={{ background: configItem.color }} />
                  <span className="text-xs text-muted-foreground">{configItem.label}</span>
                </div>
                <div className="text-xs font-medium">{formatter(item.value)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

