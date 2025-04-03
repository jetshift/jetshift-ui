import React, {useEffect, useRef, useState} from "react";
import {Expand, XIcon} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import TaskTable from "@/components/tasks/task-table";
import SchemaViewer from "@/components/tasks/schema-viewer";
import {taskService} from "@/lib/services/task-service";
import {useWebSocket} from "@/components/providers/web-socket-provider";
import {useToast} from "@/hooks/use-toast";
import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/components/ui/button";
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
import {TaskInterface} from "@/types/migration";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {subTaskService} from "@/lib/services/subtask-service";


interface ListMigrationTableProps extends React.ComponentPropsWithoutRef<"div"> {
    type?: string;
}

export default function ListTable(
    {
        className,
        type,
        ...props
    }: ListMigrationTableProps) {

    const [tables, setTables] = useState<TaskInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTable, setSelectedTable] = useState<TaskInterface | null>(null);
    const [schemaData, setSchemaData] = useState(null);
    const [openSchema, setOpenSchema] = useState(false);

    const {subscribe} = useWebSocket();
    const {toast} = useToast();
    const pathname = usePathname();

    const isFetchedTasks = useRef(false);
    const {fetchTasks, deleteTaskById, viewSchema, startMigration} = taskService();
    const {deleteSubTaskById, changeTaskStatus} = subTaskService();

    useEffect(() => {
        if (!isFetchedTasks.current) {
            isFetchedTasks.current = true;
            loadTables();
        }
    }, [type]);

    const loadTables = async () => {
        setLoading(true);
        try {
            const data = await fetchTasks(type);
            setTables(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const deleteTable = async (id: number) => {
        await deleteTaskById(id, () => loadTables());
    };

    // Listen WebSocket and update tasks in tables
    useEffect(() => {
        const unsubscribe = subscribe((data) => {
            const updated = data.message;

            setTables((prevTables) =>
                prevTables.map((table) => {
                    if (table.id !== updated.migrate_table_id) return table;

                    return {
                        ...table,
                        subtasks: table.subtasks.map((task) => {
                            if (task.id !== updated.task_id) return task;

                            return {
                                ...task,
                                status: updated.status,
                                stats: {
                                    ...task.stats,
                                    total_source_items: updated.total_source_items,
                                    total_target_items: updated.total_target_items,
                                    deployment_id: updated.deployment_id,
                                },
                            };
                        }),
                    };
                })
            );
        });

        return unsubscribe;
    }, [subscribe]);

    // Sync selectedTable with latest data from `tables`
    useEffect(() => {
        if (selectedTable) {
            const updated = tables.find((t) => t.id === selectedTable.id);
            if (updated) setSelectedTable(updated);
        }
    }, [tables]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className={cn(className)} {...props}>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Migration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tables.map((table) => (
                        <TableRow key={table.id}>
                            <TableCell>{table.id}</TableCell>
                            <TableCell>{table.title}</TableCell>
                            <TableCell>{table.source_db} ➔ {table.target_db}</TableCell>
                            <TableCell>{table.status.charAt(0).toUpperCase() + table.status.slice(1)}</TableCell>
                            <TableCell className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    title="View Tasks"
                                    onClick={() => setSelectedTable(prev => prev?.id === table.id ? null : table)}
                                >
                                    <Expand/>
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            title="Delete"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-300"
                                        >
                                            <XIcon/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete the task <strong>{table.title}</strong> and cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => deleteTable(table.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Sub tasks */}
            {selectedTable && (
                <div className="mt-6">

                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Sub Tasks of {selectedTable.title}</h2>
                        <Link className={buttonVariants({variant: "outline"})} href={`${pathname}/sub-tasks/add`}>
                            Add Sub Task
                        </Link>
                    </div>

                    <TaskTable
                        subtasks={selectedTable.subtasks}
                        onMigrate={async (task) => {
                            const response = await startMigration(task.task, task.id)
                            toast({
                                variant: response.success ? "default" : "destructive",
                                description: response.message,
                            })
                            const updated = await fetchTasks(type)
                            setTables(updated)
                        }}
                        onViewSchema={async (task) => {
                            const schema = await viewSchema(task.task, task.id)
                            setSchemaData(schema)
                            setOpenSchema(true)
                        }}
                        onChangeTaskStatus={async (task, status) => {
                            const response = await changeTaskStatus(task.id, status)
                            toast({
                                variant: response.success ? "default" : "destructive",
                                description: response.message,
                            })
                            const updated = await fetchTasks(type)
                            setTables(updated)
                        }}
                        onDeleteSubtask={async (task) => {
                            const response = await deleteSubTaskById(task.id, () => loadTables());
                            toast({
                                variant: response.success ? "default" : "destructive",
                                description: response.message,
                            });
                            const updated = await fetchTasks(type);
                            setTables(updated);
                        }}
                    />
                </div>
            )}

            {/* Schema viewer */}
            <SchemaViewer open={openSchema} onOpenChange={setOpenSchema} schemaData={schemaData}/>
        </div>
    );
}
