import React, {useEffect, useState, useRef} from "react";
import {cn} from "@/lib/utils";
import {Router, Loader, XIcon, PencilIcon} from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

import {useToast} from "@/hooks/use-toast";
import {
    fetchDatabaseList,
    checkDatabaseConnection,
    deleteDatabaseById,
} from "@/lib/services/database-service";
import LoaderSkeleton from "@/components/shared/loader-skeleton";
import EmptyState from "@/components/shared/empty-state";
import {usePathname} from "next/navigation";

interface Database {
    id: number;
    type: string;
    title: string;
    host: string;
    port: number;
    username: string;
    database: string;
    dialect: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

interface ListDatabaseProps extends React.ComponentPropsWithoutRef<"div"> {
    type?: string;
}

export default function ListDatabaseComponent(
    {
        className,
        type,
        ...props
    }: ListDatabaseProps) {
    const pathname = usePathname();
    const {toast} = useToast();

    const [loading, setLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(true);
    const [databases, setDatabases] = useState<Database[]>([]);
    const isFetchedDatabases = useRef(false);
    const [isCheckingConnection, setCheckingConnection] = useState<number | null>(null);
    const [isDeletingDatabase, setDeletingDatabase] = useState<number | null>(null);

    const fetchDatabases = async (type?: string) => {
        setLoading(true);
        setShowLoader(true);
        try {
            const data = await fetchDatabaseList(type);
            setDatabases(data);
        } catch (error) {
            toast({
                variant: "destructive",
                description: `Error fetching databases: ${error}`,
            });
        } finally {
            setLoading(false);
            setTimeout(() => setShowLoader(false), 300);
        }
    };

    const handleCheckConnection = async (id: number) => {
        setCheckingConnection(id);
        await checkDatabaseConnection(id);
        setCheckingConnection(null);
    };

    const handleDeleteDatabase = async (id: number) => {
        setDeletingDatabase(id);
        await deleteDatabaseById(id, () => fetchDatabases(type));
        setDeletingDatabase(null);
    };

    useEffect(() => {
        if (!isFetchedDatabases.current) {
            isFetchedDatabases.current = true;
            fetchDatabases(type);
        }
    }, [type]);

    // Loading
    if (showLoader) {
        return <LoaderSkeleton loading={loading} className={className} {...props} />;
    }

    // Empty data
    if (!loading && databases.length === 0) {
        return <EmptyState message="No databases found!" actionHref={`${pathname}/add`} actionLabel="Add New Database"/>;
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Table>
                <TableCaption className="hidden">A list of your recent databases.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Dialect</TableHead>
                        <TableHead>Host</TableHead>
                        <TableHead>Port</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Database</TableHead>
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
                            <TableCell>{db.type}</TableCell>
                            <TableCell>{db.dialect}</TableCell>
                            <TableCell>{db.host}</TableCell>
                            <TableCell>{db.port}</TableCell>
                            <TableCell>{db.username}</TableCell>
                            <TableCell>{db.database}</TableCell>
                            <TableCell>{db.status ? "Active" : "Inactive"}</TableCell>
                            <TableCell>{new Date(db.created_at).toLocaleString()}</TableCell>
                            <TableCell className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    title={isCheckingConnection === db.id ? "Checking connection..." : "Check connection"}
                                    onClick={() => handleCheckConnection(db.id)}
                                >
                                    {isCheckingConnection === db.id ? <Loader className="animate-spin"/> : <Router/>}
                                </Button>
                                <Link href={`/databases/${db.id}/edit`}>
                                    <Button variant="outline" size="icon" title="Edit">
                                        <PencilIcon/>
                                    </Button>
                                </Link>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-300"
                                        >
                                            <XIcon/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will permanently delete <strong>{db.title}</strong>. This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDeleteDatabase(db.id)}
                                                className="bg-red-600 hover:bg-red-700"
                                                title={`Delete`}
                                            >
                                                {isDeletingDatabase === db.id ? <Loader className="animate-spin"/> : "Confirm Delete"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
