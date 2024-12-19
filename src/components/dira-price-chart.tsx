'use client'

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Generate constant data for Dira price (always 1 AED)
const diraPriceData = Array.from({ length: 15 }, (_, i) => ({
  date: new Date(Date.now() - (14 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  price: 1
}))

export function DiraPriceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dira</CardTitle>
        <CardDescription>Price history (AED)</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={diraPriceData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Date
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].payload.date}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Price
                            </span>
                            <span className="font-bold">
                              {payload[0].value?.toFixed(2)} AED
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
              <XAxis dataKey="date" display="none" />
              <YAxis domain={[0.9, 1.1]} ticks={[0.9, 0.95, 1, 1.05, 1.1]} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

