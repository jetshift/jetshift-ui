import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useToast} from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Loader} from "lucide-react";
import {useRouter} from 'next/navigation';
import {TaskInterface} from "@/types/migration";
import {taskService} from "@/lib/services/task-service";
import {fetchDatabaseList} from "@/lib/services/database-service";

type AddDatabaseProps = React.ComponentPropsWithoutRef<"div"> & {
    type?: string;
    initialData?: Partial<TaskInterface>;
    isEdit?: boolean;
};

export default function AddEditTaskComponent(
    {
        className,
        type,
        initialData = {},
        isEdit = false,
        ...props
    }: AddDatabaseProps) {

    const router = useRouter();
    const {toast} = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<TaskInterface>({
        id: initialData.id || undefined,
        type: initialData.type || type,
        title: initialData.title || "",
        source_db: initialData.source_db || undefined,
        target_db: initialData.target_db || undefined,
        status: initialData.status || "idle",
        logs: initialData.logs || "",
    });
    const {createTask, updateTask} = taskService();
    const isFetchedDatabases = useRef(false);
    const [databases, setDatabases] = useState([]);

    const handleInputEvent = (
        e: React.ChangeEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement>
    ) => {
        const {name, value} = e.target as HTMLInputElement;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchDatabases = async () => {
        try {
            const data = await fetchDatabaseList();
            setDatabases(data);
        } catch (error) {
            toast({
                variant: "destructive",
                description: `Error fetching databases: ${error}`,
            });
        }
    };

    useEffect(() => {
        if (!isFetchedDatabases.current) {
            isFetchedDatabases.current = true;
            fetchDatabases();
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const success = isEdit
            ? await updateTask(formData)
            : await createTask(formData);

        // Redirect logic
        if (success) {
            if (type == 'etl') {
                setTimeout(() => {
                    router.push('/etl-tasks');
                }, 1500);
            }
            if (type == 'migration') {
                setTimeout(() => {
                    router.push('/migrations/tables');
                }, 1500);
            }
        }

        setIsLoading(false);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        {isEdit ? "Edit Task" : "Add Task"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        {isEdit && (
                            <input
                                type="hidden"
                                name="id"
                                value={formData.id}
                            />
                        )}

                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputEvent}
                                    onPaste={handleInputEvent}
                                    placeholder="Enter task name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div className="grid gap-2">
                                <Label htmlFor="dialect">Source Database</Label>
                                <Select
                                    value={formData.source_db?.toString() || ""}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            source_db: parseInt(value, 10),
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a database"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {databases.map((db: any) => (
                                                <SelectItem key={db.id} value={db.id.toString()}>
                                                    {db.title} ({db.dialect})
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {formData.target_db === undefined && (
                                    <span className="text-red-500 text-sm mt-1">Field is required.</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div className="grid gap-2">
                                <Label htmlFor="dialect">Target Database</Label>
                                <Select
                                    value={formData.target_db?.toString() || ""}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            target_db: parseInt(value, 10),
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a database"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {databases.map((db: any) => (
                                                <SelectItem key={db.id} value={db.id.toString()}>
                                                    {db.title} ({db.dialect})
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {formData.target_db === undefined && (
                                    <span className="text-red-500 text-sm mt-1">Field is required.</span>
                                )}
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-4">
                            {isLoading ? <Loader/> : isEdit ? "Update" : "Add"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
