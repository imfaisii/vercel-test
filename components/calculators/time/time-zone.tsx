"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// List of common time zones
const timeZones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "EST/EDT (Eastern Time)" },
  { value: "America/Chicago", label: "CST/CDT (Central Time)" },
  { value: "America/Denver", label: "MST/MDT (Mountain Time)" },
  { value: "America/Los_Angeles", label: "PST/PDT (Pacific Time)" },
  { value: "Europe/London", label: "GMT/BST (London)" },
  { value: "Europe/Paris", label: "CET/CEST (Paris, Berlin, Rome)" },
  { value: "Asia/Tokyo", label: "JST (Tokyo)" },
  { value: "Asia/Shanghai", label: "CST (China)" },
  { value: "Australia/Sydney", label: "AEST/AEDT (Sydney)" },
  { value: "Pacific/Auckland", label: "NZST/NZDT (New Zealand)" },
]

export default function TimeZoneCalculator() {
  const [sourceTime, setSourceTime] = useState("")
  const [sourceZone, setSourceZone] = useState("UTC")
  const [targetZone, setTargetZone] = useState("America/New_York")
  const [convertedTime, setConvertedTime] = useState("")
  const [currentTimes, setCurrentTimes] = useState<{ zone: string; time: string }[]>([])

  // Update current times every second
  useEffect(() => {
    const updateCurrentTimes = () => {
      const now = new Date()
      const times = timeZones.map((zone) => ({
        zone: zone.label,
        time: new Date(now.toLocaleString("en-US", { timeZone: zone.value })).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      }))
      setCurrentTimes(times)
    }

    updateCurrentTimes()
    const interval = setInterval(updateCurrentTimes, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleConvert = () => {
    try {
      if (!sourceTime) {
        setConvertedTime("Please enter a valid time")
        return
      }

      // Parse the input time
      const [hours, minutes] = sourceTime.split(":").map(Number)

      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        setConvertedTime("Please enter a valid time in 24-hour format (HH:MM)")
        return
      }

      // Create date object with today's date and the input time
      const date = new Date()
      date.setHours(hours, minutes, 0, 0)

      // Get the time difference between source and target time zones
      const sourceOffset = new Date(date.toLocaleString("en-US", { timeZone: sourceZone })).getTimezoneOffset()
      const targetOffset = new Date(date.toLocaleString("en-US", { timeZone: targetZone })).getTimezoneOffset()
      const diffMinutes = targetOffset - sourceOffset

      // Apply the difference
      date.setMinutes(date.getMinutes() - diffMinutes)

      // Format the result
      const result = date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: targetZone,
      })

      setConvertedTime(result)
    } catch (error) {
      setConvertedTime("Error converting time. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Time Zone Converter</CardTitle>
            <CardDescription>Convert time between different time zones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="source-time">Time (24-hour format)</Label>
                <Input
                  id="source-time"
                  type="time"
                  value={sourceTime}
                  onChange={(e) => setSourceTime(e.target.value)}
                  placeholder="HH:MM"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="source-zone">From Time Zone</Label>
                <Select value={sourceZone} onValueChange={setSourceZone}>
                  <SelectTrigger id="source-zone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((zone) => (
                      <SelectItem key={zone.value} value={zone.value}>
                        {zone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="target-zone">To Time Zone</Label>
                <Select value={targetZone} onValueChange={setTargetZone}>
                  <SelectTrigger id="target-zone">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((zone) => (
                      <SelectItem key={zone.value} value={zone.value}>
                        {zone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleConvert} className="w-full">
                Convert Time
              </Button>

              {convertedTime && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <p className="font-medium">Converted Time:</p>
                  <p className="text-2xl font-bold">{convertedTime}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Times Worldwide</CardTitle>
            <CardDescription>See the current time in major time zones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentTimes.slice(0, 6).map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{item.zone.split(" ")[0]}</span>
                  </div>
                  <span className="font-mono">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

