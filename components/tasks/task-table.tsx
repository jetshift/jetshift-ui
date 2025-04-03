import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {SubTaskInterface} from "@/types/migration"
import {Loader2Icon, TableIcon, RefreshCcwIcon, LogsIcon, CircleStopIcon, PlayIcon, CheckIcon, XIcon} from "lucide-react";
import React from "react";

export default function TaskTable(
    {
        subtasks,
        onMigrate,
        onViewSchema,
        onChangeTaskStatus,
        onDeleteSubtask
    }: {
        subtasks: SubTaskInterface[]
        onMigrate: (task: SubTaskInterface) => void
        onViewSchema: (task: SubTaskInterface) => void
        onChangeTaskStatus?: (task: SubTaskInterface, status: string) => void
        onDeleteSubtask?: (task: SubTaskInterface) => void
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
                {subtasks.map((task) => {
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
                                    <span>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
                                    {task.status === "syncing" && (
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
                                        case "idle":
                                            return (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Run the task"
                                                    onClick={() => onMigrate(task)}
                                                >
                                                    <RefreshCcwIcon/>
                                                </Button>
                                            )

                                        case "syncing":
                                            return (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Stop"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-300"
                                                    onClick={() => onChangeTaskStatus?.(task, 'paused')}
                                                >
                                                    <CircleStopIcon/>
                                                </Button>
                                            )

                                        case "paused":
                                            return (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Resume"
                                                    onClick={() => onChangeTaskStatus?.(task, 'syncing')}
                                                >
                                                    <PlayIcon/>
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
                                                    <CheckIcon/>
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

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            title="Delete Subtask"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-300"
                                        >
                                            <XIcon/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete the subtask <strong>{task.source_table} ➔ {task.target_table}</strong> and cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => onDeleteSubtask?.(task)}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}
