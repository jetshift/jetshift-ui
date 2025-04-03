import React, {useEffect, useState, useRef} from "react";
import {cn} from "@/lib/utils";
import {Loader, XIcon} from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {useToast} from "@/hooks/use-toast"
import {Button} from "@/components/ui/button";
import api from "@/lib/api";
import {MigrateDatabaseInterface} from "@/types/migration";
import LoaderSkeleton from "@/components/shared/loader-skeleton";
import EmptyState from "@/components/shared/empty-state";

type ListDatabaseProps = React.ComponentPropsWithoutRef<"div">

export default function ListMigrationDatabase(
    {
        className,
        ...props
    }: ListDatabaseProps) {
    const {toast} = useToast()
    const [loading, setLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(true);
    const [databases, setDatabases] = useState<MigrateDatabaseInterface[]>([]);
    const isFetchedDatabases = useRef(false);
    const [isDeletingDatabase, setDeletingDatabase] = useState<number | null>(null);

    const fetchDatabases = async () => {
        setLoading(true);
        setShowLoader(true);

        try {
            const response = await api.get(`/migrate/databases/`);

            const data = response.data;
            setDatabases(data.data || []);
        } catch (error) {
            toast({
                variant: "destructive",
                description: `Error fetching databases: ${error}`,
            })
        } finally {
            setLoading(false);
            setTimeout(() => setShowLoader(false), 300);
        }
    };

    const deleteDatabase = async (id: number) => {
        try {
            //
        } catch (error) {
            toast({
                variant: "destructive",
                description: `Error checking connection for ID ${id}: ${error}`,
            })
        } finally {
            setDeletingDatabase(null);
        }
    };

    useEffect(() => {
        if (!isFetchedDatabases.current) {
            isFetchedDatabases.current = true;
            fetchDatabases();
        }
    });

    // Loading
    if (showLoader) {
        return <LoaderSkeleton loading={loading} className={className} {...props} />;
    }

    // Empty data
    if (!loading && databases.length === 0) {
        return <EmptyState message="No migration databases found!"/>;
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Table>
                <TableCaption className="hidden">A list of your recent databases.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Source DB</TableHead>
                        <TableHead>Target DB</TableHead>
                        <TableHead>Logs</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {databases.map((db) => (
                        <TableRow key={db.id}>
                            <TableCell className="font-medium">{db.id}</TableCell>
                            <TableCell>{db.title}</TableCell>
                            <TableCell>{db.source_db}</TableCell>
                            <TableCell>{db.target_db}</TableCell>
                            <TableCell>{db.logs}</TableCell>
                            <TableCell>{db.status ? "Active" : "Inactive"}</TableCell>
                            <TableCell>{new Date(db.created_at).toLocaleString()}</TableCell>
                            <TableCell className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    title="Delete"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-300"
                                    onClick={() => deleteDatabase(db.id)}
                                >
                                    {isDeletingDatabase === db.id ? <Loader/> : <XIcon/>}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
