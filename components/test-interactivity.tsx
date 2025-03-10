"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestInteractivity() {
  const [count, setCount] = useState(0)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Interactivity Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <p>Count: {count}</p>
          <div className="flex gap-4">
            <Button onClick={() => setCount(count + 1)}>Increment</Button>
            <Button variant="outline" onClick={() => setCount(0)}>
              Reset
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            If you can click these buttons and see the count change, client-side interactivity is working.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

