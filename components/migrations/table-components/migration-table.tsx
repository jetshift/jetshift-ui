import {useEffect, useState} from "react";
import {Expand, CircleX} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import TaskCard from "@/components/migrations/table-components/task-card";
import SchemaViewer from "@/components/migrations/table-components/schema-viewer";
import {useMigrationTables} from "@/hooks/use-migration-tables";
import {useWebSocket} from "@/components/providers/web-socket-provider";
import {MigrateTable} from "@/types/migration";
import {useToast} from "@/hooks/use-toast";

export default function MigrationTable() {
    const [tables, setTables] = useState<MigrateTable[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTable, setSelectedTable] = useState<MigrateTable | null>(null);
    const [schemaData, setSchemaData] = useState(null);
    const [openSchema, setOpenSchema] = useState(false);

    const {fetchTables, deleteTable, startMigration, viewSchema} = useMigrationTables();
    const {subscribe} = useWebSocket();
    const {toast} = useToast();

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchTables();
                setTables(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Listen WebSocket and update tasks in tables
    useEffect(() => {
        const unsubscribe = subscribe((data) => {
            const updated = data.message;

            setTables((prevTables) =>
                prevTables.map((table) => {
                    if (table.id !== updated.migrate_table_id) return table;

                    return {
                        ...table,
                        tasks: table.tasks.map((task) => {
                            if (task.id !== updated.task_id) return task;

                            return {
                                ...task,
                                status: updated.status,
                                stats: {
                                    ...task.stats,
                                    total_source_items: updated.total_source_items,
                                    total_target_items: updated.total_target_items,
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
        <div>
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
                            <TableCell>{table.status}</TableCell>
                            <TableCell className="flex items-center space-x-2">
                                <span onClick={() => setSelectedTable(table)} className="cursor-pointer">
                                    <Expand color="green"/>
                                </span>
                                <span onClick={() => deleteTable(table.id)} className="cursor-pointer ml-2">
                                    <CircleX color="red"/>
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedTable && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">Tasks for {selectedTable.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {selectedTable.tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onMigrate={async () => {
                                    const response = await startMigration(task.migrate_table_id, task.id);
                                    toast({
                                        variant: response.success ? "default" : "destructive",
                                        description: response.message,
                                    });
                                    // const updated = await fetchTables();
                                    // setTables(updated);
                                }}
                                onViewSchema={async () => {
                                    const schema = await viewSchema(task.migrate_table_id, task.id);
                                    setSchemaData(schema);
                                    setOpenSchema(true);
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <SchemaViewer open={openSchema} onOpenChange={setOpenSchema} schemaData={schemaData}/>
        </div>
    );
}
