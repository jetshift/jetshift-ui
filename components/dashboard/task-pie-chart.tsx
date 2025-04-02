"use client"

import {useEffect, useState} from "react"
import {Pie, PieChart} from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {fetchTaskChart} from "@/lib/api/charts"

type ChartDatum = {
    status: string
    total: number
    fill: string
}

type ChartProps = {
    title?: string,
    type?: string
}

export function TaskPieChart({title, type}: ChartProps) {
    const [chartData, setChartData] = useState<ChartDatum[]>([])
    const [chartConfig, setChartConfig] = useState<ChartConfig>({})

    useEffect(() => {
        const loadChart = async () => {
            try {
                const response = await fetchTaskChart(type)

                const knownColors: Record<string, string> = {
                    Idle: "#a8a29e",        // gray-400 → inactive
                    Syncing: "#2db4a4",     // teal → in progress
                    Paused: "#fbbf24",      // amber → paused/waiting
                    Failed: "#ef4444",      // red → failed/error
                    Pending: "#64748b",     // slate → waiting to run
                    Completed: "#22c55e",   // green-500 → success ✅
                }

                const fallbackPalette = [
                    "#2db4a4", // teal
                    "#e66b4d", // coral
                    "#f4aa51", // orange
                    "#ebcd4a", // mustard
                    "#233646", // navy
                ]

                const dynamicData: ChartDatum[] = response.map((item, index) => {
                    const knownColor = knownColors[item.status]
                    return {
                        status: item.status,
                        total: item.count,
                        fill: knownColor || fallbackPalette[index % fallbackPalette.length],
                    }
                })

                const config: ChartConfig = {
                    total: {label: "Tasks"},
                }

                response.forEach((item, index) => {
                    const knownColor = knownColors[item.status]
                    config[item.status.toLowerCase()] = {
                        label: item.status,
                        color: knownColor || fallbackPalette[index % fallbackPalette.length],
                    }
                })

                setChartData(dynamicData)
                setChartConfig(config)
            } catch (err) {
                console.error("Failed to load ETL chart data:", err)
            }
        }

        loadChart()
    }, [])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel/>}/>
                        <Pie
                            data={chartData}
                            dataKey="total"
                            label
                            nameKey="status"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
