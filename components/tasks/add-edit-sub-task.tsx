import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
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
import {SubTaskInterface} from "@/types/migration";
import {taskService} from "@/lib/services/task-service";
import {subTaskService} from "@/lib/services/subtask-service";

type AddDatabaseProps = React.ComponentPropsWithoutRef<"div"> & {
    type?: string;
    initialData?: Partial<SubTaskInterface>;
    isEdit?: boolean;
};

export default function AddEditSubTaskComponent(
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

    const [formData, setFormData] = useState<SubTaskInterface>({
        id: initialData.id || undefined,
        task: initialData?.task?.toString() || "",
        source_table: initialData.source_table || "",
        target_table: initialData.target_table || "",
        status: initialData.status || "idle",
        config: {
            primary_id: initialData?.config?.primary_id || "",
            extract_offset: initialData?.config?.extract_offset || 0,
            extract_limit: initialData?.config?.extract_limit || 10,
            extract_chunk_size: initialData?.config?.extract_chunk_size || undefined,
            truncate_table: Boolean(initialData?.config?.truncate_table),
            load_chunk_size: initialData?.config?.load_chunk_size || 20,
            sleep_interval: initialData?.config?.sleep_interval || 1,
            live_schema: initialData?.config?.live_schema !== undefined
                ? Boolean(initialData.config.live_schema)
                : true,
        },
        cron: initialData.cron || "* * * * *",
        error: initialData.error || "",
    });

    const {fetchTasks} = taskService();
    const {createSubTask, updateSubTask} = subTaskService();
    const isFetchedTasks = useRef(false);
    const [tasks, setTasks] = useState([]);

    const handleInputEvent = (
        e: React.ChangeEvent<HTMLInputElement> | React.ClipboardEvent<HTMLInputElement>
    ) => {
        const {name, value} = e.target as HTMLInputElement;

        // Handle nested config fields
        if ([
            "primary_id",
            "extract_offset",
            "extract_limit",
            "extract_chunk_size",
            "load_chunk_size",
            "sleep_interval"
        ].includes(name)) {
            setFormData((prev) => ({
                ...prev,
                config: {
                    ...prev.config,
                    [name]: value,
                }
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const loadTasks = async (type?: string) => {
        try {
            const data = await fetchTasks(type);
            setTasks(data);
        } catch (error) {
            toast({
                variant: "destructive",
                description: `Error fetching tasks: ${error}`,
            });
        }
    };

    useEffect(() => {
        if (!isFetchedTasks.current) {
            isFetchedTasks.current = true;
            loadTasks(type);
        }
    }, [type]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const success = isEdit
            ? await updateSubTask(formData)
            : await createSubTask(formData);

        // Redirect logic
        if (success) {
            if (type == 'etl') {
                setTimeout(() => {
                    router.push('/etl-tasks');
                }, 1000);
            }
            if (type == 'cdc') {
                setTimeout(() => {
                    router.push('/cdc-tasks');
                }, 1000);
            }
            if (type == 'migration') {
                setTimeout(() => {
                    router.push('/migrations/tables');
                }, 1000);
            }
        }

        setIsLoading(false);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        {isEdit ? "Edit Sub Task" : "Add Sub Task"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div className="grid gap-2">
                                <Label htmlFor="task">Task</Label>
                                <Select
                                    value={formData.task}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            task: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a task"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {tasks.map((task: any) => (
                                                <SelectItem key={task.id} value={task.id.toString()}>
                                                    {task.title}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {formData.task === "" && (
                                    <span className="text-red-500 text-sm mt-1">Field is required.</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div className="grid gap-2">
                                <Label htmlFor="sourceTable">Source Table</Label>
                                <Input
                                    id="sourceTable"
                                    type="text"
                                    name="source_table"
                                    value={formData.source_table}
                                    onChange={handleInputEvent}
                                    onPaste={handleInputEvent}
                                    placeholder="Enter table name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div className="grid gap-2">
                                <Label htmlFor="targetTable">Target Table</Label>
                                <Input
                                    id="targetTable"
                                    type="text"
                                    name="target_table"
                                    value={formData.target_table}
                                    onChange={handleInputEvent}
                                    onPaste={handleInputEvent}
                                    placeholder="Enter table name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div className="grid gap-2">
                                <Label htmlFor="primaryId">Primary ID</Label>
                                <Input
                                    id="primaryId"
                                    type="text"
                                    name="primary_id"
                                    value={formData.config?.primary_id}
                                    onChange={handleInputEvent}
                                    onPaste={handleInputEvent}
                                    placeholder="Primary id or leave empty"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="extractOffset">Extract Offset</Label>
                                    <Input
                                        id="extractOffset"
                                        type="number"
                                        name="extract_offset"
                                        value={formData.config?.extract_offset}
                                        onChange={handleInputEvent}
                                        onPaste={handleInputEvent}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="extractLimit">Extract Limit</Label>
                                    <Input
                                        id="extractLimit"
                                        type="number"
                                        name="extract_limit"
                                        value={formData.config?.extract_limit}
                                        onChange={handleInputEvent}
                                        onPaste={handleInputEvent}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="extractChunkSize">Extract Chunk Size</Label>
                                    <Input
                                        id="extractChunkSize"
                                        type="number"
                                        name="extract_chunk_size"
                                        value={formData.config?.extract_chunk_size}
                                        onChange={handleInputEvent}
                                        onPaste={handleInputEvent}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="truncateTable">Truncate Table</Label>
                                    <Select
                                        value={formData.config?.truncate_table?.toString()}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                config: {
                                                    ...prev.config,
                                                    truncate_table: value === "true",
                                                },
                                            }))
                                        }
                                    >
                                        <SelectTrigger id="truncateTable">
                                            <SelectValue placeholder="True or false"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="false">False</SelectItem>
                                                <SelectItem value="true">True</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/*<div className="grid gap-2">*/}
                                {/*    <Label htmlFor="liveSchema">Live Schema</Label>*/}
                                {/*    <Select*/}
                                {/*        value={formData.config?.live_schema?.toString()}*/}
                                {/*        onValueChange={(value) =>*/}
                                {/*            setFormData((prev) => ({*/}
                                {/*                ...prev,*/}
                                {/*                config: {*/}
                                {/*                    ...prev.config,*/}
                                {/*                    live_schema: value === "true",*/}
                                {/*                },*/}
                                {/*            }))*/}
                                {/*        }*/}
                                {/*    >*/}
                                {/*        <SelectTrigger id="liveSchema">*/}
                                {/*            <SelectValue placeholder="True or false"/>*/}
                                {/*        </SelectTrigger>*/}
                                {/*        <SelectContent>*/}
                                {/*            <SelectGroup>*/}
                                {/*                <SelectItem value="false">False</SelectItem>*/}
                                {/*                <SelectItem value="true">True</SelectItem>*/}
                                {/*            </SelectGroup>*/}
                                {/*        </SelectContent>*/}
                                {/*    </Select>*/}
                                {/*</div>*/}

                                <div className="grid gap-2">
                                    <Label htmlFor="loadChunkSize">Load Chunk Size</Label>
                                    <Input
                                        id="loadChunkSize"
                                        type="number"
                                        name="load_chunk_size"
                                        value={formData.config?.load_chunk_size}
                                        onChange={handleInputEvent}
                                        onPaste={handleInputEvent}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="sleepInterval">Sleep Interval</Label>
                                    <Input
                                        id="sleepInterval"
                                        type="number"
                                        name="sleep_interval"
                                        value={formData.config?.sleep_interval}
                                        onChange={handleInputEvent}
                                        onPaste={handleInputEvent}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 mt-6">
                            <div className="grid gap-2">
                                <Label htmlFor="cron">Cron</Label>
                                <Input
                                    id="cron"
                                    type="text"
                                    name="cron"
                                    value={formData.cron}
                                    onChange={handleInputEvent}
                                    onPaste={handleInputEvent}
                                    placeholder="* * * * *"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-6">
                            {isLoading ? <Loader/> : isEdit ? "Update" : "Add"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
