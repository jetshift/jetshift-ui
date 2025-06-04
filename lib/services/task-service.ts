import {TaskInterface} from "@/types/migration";
import api from "@/lib/api";
import {toast} from "@/hooks/use-toast";

export const taskService = () => {

    const fetchTasks = async (type?: string) => {
        try {
            const response = await api.get(`/tasks${type ? `?type=${type}` : ""}`);
            const data = response.data;

            const mappedData: TaskInterface[] = data.data.map((job: any) => ({
                id: job.id,
                type: job.type,
                title: job.title,
                source_db: job.source_database?.title || '',
                target_db: job.target_database?.title || '',
                status: job.status,
                logs: job.logs,
                subtasks: job.subtasks?.map((task: any) => ({
                    id: task.id,
                    task: task.task,
                    source_table: task.source_table,
                    target_table: task.target_table,
                    status: task.status,
                    config: task.config,
                    stats: task.stats,
                    deployment_id: task.deployment_id,
                    cron: task.cron,
                    error: task.error,
                })) || [],
                created_at: job.created_at,
                updated_at: job.updated_at,
            }));

            return mappedData;
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: `Failed to fetch tasks: ${error?.response?.data?.message || error.message}`,
            });
            return [];
        }
    };

    const createTask = async (formData: any): Promise<boolean> => {
        try {
            const response = await api.post("/tasks/", formData);
            const data = response.data;

            if (data.success) {
                toast({description: data.message});
                return true;
            } else {
                toast({
                    variant: "destructive",
                    description: data.message,
                });
                return false;
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || error.message;
            toast({
                variant: "destructive",
                description: `Database creation failed: ${message}`,
            });
            return false;
        }
    };

    const getTaskById = async (id: number) => {
        try {
            const response = await api.get(`/tasks/${id}/`);
            return response.data.data;
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: `Error fetching task ID ${id}: ${error?.response?.data?.message || error.message}`,
            });
        }
    };

    const updateTask = async (formData: any): Promise<boolean> => {
        try {
            const response = await api.patch(`/tasks/${formData.id}/`, formData); // include ID here
            const data = response.data;

            if (data.success) {
                toast({description: data.message});
                return true;
            } else {
                toast({
                    variant: "destructive",
                    description: data.message,
                });
                return false;
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || error.message;
            toast({
                variant: "destructive",
                description: `Database update failed: ${message}`,
            });
            return false;
        }
    };

    const deleteTaskById = async (id: number, refreshCallback: () => void) => {
        try {
            const response = await api.delete(`/tasks/${id}/`);
            const data = response.data;

            if (data.success) {
                refreshCallback();
                toast({description: `${data.message}`});
            } else {
                toast({variant: "destructive", description: `${data.message}`});
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: `Error deleting database ID ${id}: ${error?.response?.data?.message || error.message}`,
            });
        }
    };

    const viewSchema = async (migrate_table_id: number, task_id: number, create_schema: string) => {
        try {
            const response = await api.get(`/tasks/${migrate_table_id}/schema/?task_id=${task_id}&create=${create_schema}`);
            return response.data;
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: `Failed to fetch schema: ${error?.response?.data?.message || error.message}`,
            });
            throw error;
        }
    };

    const startMigration = async (task_type, task_id: number, subtask_id: number) => {
        try {
            if (task_type === 'cdc') {
                const response = await api.get(`/subtasks/${subtask_id}/cdc/`);
                return response.data;
            } else {
                const response = await api.get(`/tasks/${task_id}/sync/?task_id=${subtask_id}`);
                return response.data;
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: `Failed to start migration: ${error?.response?.data?.message || error.message}`,
            });
            throw error;
        }
    };

    return {fetchTasks, createTask, getTaskById, updateTask, deleteTaskById, viewSchema, startMigration};
};
