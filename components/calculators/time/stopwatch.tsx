"use client"

import { useState, useEffect, useRef } from "react"
import { RotateCcw, Play, Pause, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function StopwatchCalculator() {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [laps, setLaps] = useState<number[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startStopwatch = () => {
    if (isRunning) return

    setIsRunning(true)
    startTimeRef.current = Date.now() - elapsedTime

    intervalRef.current = setInterval(() => {
      setElapsedTime(Date.now() - startTimeRef.current)
    }, 10) // Update every 10ms for smoother display
  }

  const pauseStopwatch = () => {
    if (!isRunning) return

    setIsRunning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resetStopwatch = () => {
    pauseStopwatch()
    setElapsedTime(0)
    setLaps([])
  }

  const addLap = () => {
    if (!isRunning) return
    setLaps([...laps, elapsedTime])
  }

  // Format time as HH:MM:SS.ms
  const formatTime = (time: number) => {
    const milliseconds = Math.floor((time % 1000) / 10)
    const seconds = Math.floor((time / 1000) % 60)
    const minutes = Math.floor((time / (1000 * 60)) % 60)
    const hours = Math.floor(time / (1000 * 60 * 60))

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  // Calculate lap differences
  const getLapDifference = (index: number) => {
    if (index === 0) return laps[0]
    return laps[index] - laps[index - 1]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stopwatch</CardTitle>
          <CardDescription>Track elapsed time with precision</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="text-6xl font-mono font-bold tabular-nums">{formatTime(elapsedTime)}</div>
            </div>

            <div className="flex justify-center gap-4">
              {!isRunning ? (
                <Button onClick={startStopwatch} className="w-24">
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </Button>
              ) : (
                <Button onClick={pauseStopwatch} variant="outline" className="w-24">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
              )}

              <Button onClick={resetStopwatch} variant="destructive" className="w-24">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>

              <Button onClick={addLap} variant="secondary" disabled={!isRunning} className="w-24">
                <Save className="mr-2 h-4 w-4" />
                Lap
              </Button>
            </div>

            {laps.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Laps</h3>
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-3 bg-muted p-2 text-sm font-medium">
                    <div>Lap</div>
                    <div>Time</div>
                    <div>Lap Time</div>
                  </div>
                  <Separator />
                  <div className="max-h-60 overflow-y-auto">
                    {laps
                      .map((lap, index) => (
                        <div key={index}>
                          <div className="grid grid-cols-3 p-2 text-sm">
                            <div>#{laps.length - index}</div>
                            <div className="font-mono">{formatTime(lap)}</div>
                            <div className="font-mono">{formatTime(getLapDifference(index))}</div>
                          </div>
                          {index < laps.length - 1 && <Separator />}
                        </div>
                      ))
                      .reverse()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

