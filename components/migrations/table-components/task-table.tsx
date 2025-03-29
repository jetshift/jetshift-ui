import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {MigrationTask} from "@/types/migration"
import {Loader2Icon, TableIcon, RefreshCcwIcon, LogsIcon, CircleStopIcon, CheckIcon} from "lucide-react";
import React from "react";

export default function TaskCard(
    {
        tasks,
        onMigrate,
        onViewSchema,
        onStopMigration,
    }: {
        tasks: MigrationTask[]
        onMigrate: (task: MigrationTask) => void
        onViewSchema: (task: MigrationTask) => void
        onStopMigration?: (task: MigrationTask) => void
    }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Source ➔ Target</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Chunk Size</TableHead>
                    <TableHead>Source Items</TableHead>
                    <TableHead>Target Items</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Error</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.map((task) => {
                    const totalSource = task.stats?.total_source_items ?? 0
                    const totalTarget = task.stats?.total_target_items ?? 0
                    const completePercentage =
                        totalSource > 0
                            ? ((totalTarget / totalSource) * 100).toFixed(1)
                            : "0.0"

                    return (
                        <TableRow key={task.id}>
                            <TableCell>
                                {task.source_table} ➔ {task.target_table}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-2">
                                    <span>{task.status}</span>
                                    {task.status === "migrating" && (
                                        <Loader2Icon className="animate-spin w-4 h-4"/>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>{task.config?.extract_chunk_size ?? "N/A"}</TableCell>
                            <TableCell>{totalSource}</TableCell>
                            <TableCell>{totalTarget}</TableCell>
                            <TableCell>{completePercentage}%</TableCell>
                            <TableCell>
                                {task.error ? (
                                    <span className="text-red-500">{task.error}</span>
                                ) : (
                                    <span className="text-green-600">No errors</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    title="View Schema"
                                    onClick={() => onViewSchema(task)}
                                >
                                    <TableIcon/>
                                </Button>

                                {(() => {
                                    switch (task.status) {
                                        case "pending":
                                        case "paused":
                                            return (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Migrate"
                                                    onClick={() => onMigrate(task)}
                                                >
                                                    <RefreshCcwIcon/>
                                                </Button>
                                            )

                                        case "migrating":
                                            return (
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    title="Stop"
                                                    onClick={() => onStopMigration?.(task)}
                                                >
                                                    <CircleStopIcon/>
                                                </Button>
                                            )

                                        case "completed":
                                            return (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Completed"
                                                    className="bg-green-600 text-white hover:bg-green-700"
                                                    disabled
                                                >
                                                    <CheckIcon />
                                                </Button>
                                            )

                                        default:
                                            return null
                                    }
                                })()}

                                {task.deployment_id && (
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_PREFECT_URL}/deployments/deployment/${task.deployment_id}?tab=Runs`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            title="View Deployments"
                                        >
                                            <LogsIcon/>
                                        </Button>
                                    </a>
                                )}
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
