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
import {fetchDatabaseChart} from "@/lib/api/charts"

type ChartDatum = {
    type: string
    total: number
    fill: string
}

type ChartProps = {
    title?: string,
    type?: string
}

export function DatabasePieChart({title}: ChartProps) {
    const [chartData, setChartData] = useState<ChartDatum[]>([])
    const [chartConfig, setChartConfig] = useState<ChartConfig>({})

    useEffect(() => {
        const loadChart = async () => {
            try {
                const response = await fetchDatabaseChart()

                const knownColors: Record<string, string> = {
                    Source: "#e66b4d",
                    Target: "#2db4a4",
                }

                const fallbackPalette = [
                    "#2db4a4", "#e66b4d", "#f4aa51", "#ebcd4a", "#233646"
                ]

                const dynamicData: ChartDatum[] = response.map((item, index) => {
                    const knownColor = knownColors[item.type]
                    return {
                        type: item.type,
                        total: item.count,
                        fill: knownColor || fallbackPalette[index % fallbackPalette.length],
                    }
                })

                const config: ChartConfig = {
                    total: {label: "Tasks"},
                }

                response.forEach((item, index) => {
                    const knownColor = knownColors[item.type]
                    config[item.type.toLowerCase()] = {
                        label: item.type,
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
                {chartData.length === 0 ? (
                    <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
                        No data available
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                    >
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie
                                data={chartData}
                                dataKey="total"
                                label
                                nameKey="type"
                            />
                        </PieChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
