import {useEffect, useState, useRef} from "react";
import {cn} from "@/lib/utils";
import {Loader, Expand, CircleX} from "lucide-react";
import {useToast} from "@/hooks/use-toast"
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"


interface MigrationTask {
    id: number;
    migrate_table_id: number,
    source_table: string;
    target_table: string;
    status: string;
    error: string;
}

interface MigrateTable {
    id: number;
    title: string;
    source_db: string;
    target_db: string;
    status: boolean;
    logs: string;
    tasks: MigrationTask[];
    created_at: string;
    updated_at: string;
}

type ListDatabaseProps = React.ComponentPropsWithoutRef<"div">

export default function ListMigrationTable(
    {
        className,
        ...props
    }: ListDatabaseProps) {

    const {toast} = useToast()
    const [tables, setDatabases] = useState<MigrateTable[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const isFetchedDatabases = useRef(false);
    const [isDeletingDatabase, setDeletingDatabase] = useState<number | null>(null);

    const [openTasksView, setOpenTasksView] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);

    const [schemaData, setSchemaData] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const fetchTables = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/migrate/tables`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch databases");
            }
            const data = await response.json();

            const mappedData: MigrateTable[] = data.data.map((job: any) => ({
                id: job.id,
                title: job.title,
                source_db: job.source_database?.title || '',
                target_db: job.target_database?.title || '',
                status: job.status,
                logs: job.logs,
                tasks: job.tasks?.map((task: any) => ({
                    id: task.id,
                    migrate_table_id: task.migrate_table,
                    source_table: task.source_table,
                    target_table: task.target_table,
                    status: task.status,
                    error: task.error,
                })) || [],
                created_at: job.created_at,
                updated_at: job.updated_at,
            }));

            setDatabases(mappedData);
        } catch (error) {
            toast({
                variant: "destructive",
                description: `Error fetching databases: ${error}`,
            });
        } finally {
            setLoading(false);
        }
    };

    const deleteTable = async (id: number) => {
        try {
            setDeletingDatabase(id);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/databases/delete/${id}`,
                {
                    method: "POST",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to delete database");
            }
            const data = await response.json();

            if (data.success) {
                fetchTables();
                toast({
                    description: `${data.message}`,
                })
            } else {
                toast({
                    variant: "destructive",
                    description: `${data.message}`,
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: `Error checking connection for ID ${id}: ${error}`,
            })
        } finally {
            setDeletingDatabase(null);
        }
    };

    const startMigration = async (migrate_table_id: number, task_id: number) => {
        try {
            // setDeletingDatabase(task_id);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/migrate/tables/${migrate_table_id}/migrate/?task_id=${task_id}`,
                {
                    method: "GET",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to delete database");
            }
            const data = await response.json();

            if (data.success) {
                fetchTables();
                toast({
                    description: `${data.message}`,
                })
            } else {
                toast({
                    variant: "destructive",
                    description: `${data.message}`,
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: `Error checking connection for ID ${task_id}: ${error}`,
            })
        } finally {
            // setDeletingDatabase(null);
        }
    };

    const viewSchema = async (migrate_table_id: number, task_id: number) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/migrate/tables/${migrate_table_id}/schema/?task_id=${task_id}`,
                {
                    method: "GET",
                }
            );
            if (!response.ok) {
                throw new Error("Failed to delete database");
            }
            const data = await response.json();

            if (data.success) {
                toast({
                    description: `${data.message}`,
                })
                setSchemaData(data);
                setOpenDialog(true);
            } else {
                toast({
                    variant: "destructive",
                    description: `${data.message}`,
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                description: `Error checking connection for ID ${task_id}: ${error}`,
            })
        } finally {
            //
        }
    };

    useEffect(() => {
        if (!isFetchedDatabases.current) {
            isFetchedDatabases.current = true;
            fetchTables();
        }
    });

    if (loading) {
        return <p>Loading tables...</p>;
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Table>
                <TableCaption className="hidden">A list of your recent databases.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Migration Pair</TableHead>
                        <TableHead>Logs</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tables.map((table) => (
                        <TableRow key={table.id}>
                            <TableCell className="font-medium">{table.id}</TableCell>
                            <TableCell>{table.title}</TableCell>
                            <TableCell>{table.source_db} {'->'} {table.target_db}</TableCell>
                            <TableCell>{table.logs}</TableCell>
                            <TableCell>{table.status ? "Active" : "Inactive"}</TableCell>
                            <TableCell>{new Date(table.created_at).toLocaleString()}</TableCell>
                            <TableCell className="flex items-center space-x-2">

                                <span
                                    className="cursor-pointer"
                                    title="Open Sheet"
                                    onClick={() => {
                                        setSelectedTable(table);
                                        setOpenTasksView(true);
                                    }}
                                >
                                <Expand color="green"/>
                                </span>

                                <span
                                    className="cursor-pointer"
                                    title={"Delete job"}
                                    onClick={() => deleteTable(table.id)}
                                >
                                {isDeletingDatabase === table.id ? <Loader/> : <CircleX color={"#E3646F"}/>}
                                </span>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Tasks */}
            {openTasksView && selectedTable && (
                <div className="p-6 rounded border shadow bg-white max-w-full mt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">{selectedTable.title}</h2>
                        <Button
                            variant="outline"
                            onClick={() => setOpenTasksView(false)}
                        >
                            Close
                        </Button>
                    </div>

                    <div className="grid gap-4 grid-cols-1 xl:grid-cols-4">
                        {selectedTable?.tasks.map((task: any) => (
                            <Card key={task.id} className="w-full max-w-full">
                                <CardHeader>
                                    <CardTitle>{task.source_table} ➔ {task.target_table}</CardTitle>
                                    <CardDescription>Status: {task.status}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {task.error ? (
                                        <p className="text-red-500">Error: {task.error}</p>
                                    ) : (
                                        <p>No errors</p>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            // setSelectedTableTask(task);
                                            viewSchema(task.migrate_table_id, task.id);
                                            //
                                        }}
                                    >View Schema
                                    </Button>
                                    <Button
                                        onClick={() => startMigration(task.migrate_table_id, task.id)}
                                    >Migrate
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                </div>
            )}

            {/* Schema */}
            <Sheet open={openDialog} onOpenChange={setOpenDialog}>
                <SheetContent side={"bottom"}>
                    <SheetHeader>
                        <SheetTitle>Schema Details</SheetTitle>
                        <SheetDescription>
                            {schemaData ? (
                                <>
                                    <Tabs defaultValue="source_schema" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="source_schema">{schemaData.source.database} - {schemaData.source.table}</TabsTrigger>
                                            <TabsTrigger value="target_schema">{schemaData.target.database} - {schemaData.target.table}</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="source_schema">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Field</TableHead>
                                                        <TableHead>Type</TableHead>
                                                        <TableHead>Nullable</TableHead>
                                                        <TableHead>Primary Key</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {schemaData.source.schema.map((col: any) => (
                                                        <TableRow key={col.name}>
                                                            <TableCell>{col.name}</TableCell>
                                                            <TableCell>{col.type}</TableCell>
                                                            <TableCell>{col.nullable ? "Yes" : "No"}</TableCell>
                                                            <TableCell>{col.primary_key ? "Yes" : "No"}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TabsContent>
                                        <TabsContent value="target_schema">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Field</TableHead>
                                                        <TableHead>Type</TableHead>
                                                        <TableHead>Nullable</TableHead>
                                                        <TableHead>Primary Key</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {schemaData.target.schema.map((col: any) => (
                                                        <TableRow key={col.name}>
                                                            <TableCell>{col.name}</TableCell>
                                                            <TableCell>{col.type}</TableCell>
                                                            <TableCell>{col.nullable ? "Yes" : "No"}</TableCell>
                                                            <TableCell>{col.primary_key ? "Yes" : "No"}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TabsContent>
                                    </Tabs>
                                </>
                            ) : (
                                "Loading schema..."
                            )}
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

        </div>
    );
}
