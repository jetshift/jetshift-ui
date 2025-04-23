import React, {useEffect, useState, useRef} from "react";
import {cn} from "@/lib/utils";
import {Loader, XIcon, PencilIcon} from "lucide-react";
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
    fetchUserList,
    deleteById,
} from "@/lib/services/user-service";
import LoaderSkeleton from "@/components/shared/loader-skeleton";
import EmptyState from "@/components/shared/empty-state";
import {usePathname} from "next/navigation";
import {Badge} from "@/components/ui/badge"

import {UserInterface} from "@/types/migration";


interface ListUserProps extends React.ComponentPropsWithoutRef<"div"> {
    type?: string;
}

export default function ListUserComponent(
    {
        className,
        type,
        ...props
    }: ListUserProps) {
    const pathname = usePathname();
    const {toast} = useToast();

    const [loading, setLoading] = useState(true);
    const [showLoader, setShowLoader] = useState(true);
    const [users, setUsers] = useState<UserInterface[]>([]);
    const isFetchedUsers = useRef(false);
    const [isDeletingUser, setDeletingUser] = useState<number | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setShowLoader(true);
        try {
            const data = await fetchUserList();
            setUsers(data);
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

    const handleDeleteDatabase = async (id: number) => {
        setDeletingUser(id);
        await deleteById(id, () => fetchUsers(type));
        setDeletingUser(null);
    };

    useEffect(() => {
        if (!isFetchedUsers.current) {
            isFetchedUsers.current = true;
            fetchUsers(type);
        }
    }, [type]);

    // Loading
    if (showLoader) {
        return <LoaderSkeleton loading={loading} className={className} {...props} />;
    }

    // Empty data
    if (!loading && users.length === 0) {
        return <EmptyState message="No users found!" actionHref={`${pathname}/add`} actionLabel="Add New User"/>;
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Table>
                <TableCaption className="hidden">A list of your recent databases.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Superuser</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                {user.is_superuser ? (
                                    <Badge>Yes</Badge>
                                ) : (
                                    <Badge variant="outline">No</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                {user.is_active ? (
                                    <Badge>Yes</Badge>
                                ) : (
                                    <Badge variant="outline">No</Badge>
                                )}
                            </TableCell>
                            <TableCell>{new Date(user.date_joined).toLocaleString()}</TableCell>
                            <TableCell className="flex items-center space-x-2">
                                <Link href={`/databases/${user.id}/edit`}>
                                    <Button variant="outline" size="icon" title="Edit">
                                        <PencilIcon/>
                                    </Button>
                                </Link>

                                {!user.is_superuser && (
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
                                                    This will permanently delete <strong>{user.title}</strong>. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteDatabase(user.id)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                    title={`Delete`}
                                                >
                                                    {isDeletingUser === user.id ? <Loader className="animate-spin"/> : "Confirm Delete"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
