import {MigrateTable} from "@/types/migration";
import api from "@/lib/api";
import {toast} from "@/hooks/use-toast";

export const tableService = () => {

    const fetchTables = async (type?: string) => {
        try {
            const response = await api.get(`/tables${type ? `?type=${type}` : ""}`);
            const data = response.data;

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
                    config: task.config,
                    stats: task.stats,
                    deployment_id: task.deployment_id,
                    error: task.error,
                })) || [],
                created_at: job.created_at,
                updated_at: job.updated_at,
            }));

            return mappedData;
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: `Failed to fetch tables: ${error?.response?.data?.message || error.message}`,
            });
            return [];
        }
    };

    const deleteTable = async (id: number) => {
        try {
            const response = await api.post(`/databases/delete/${id}`);
            return response.data;
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: `Failed to delete table: ${error?.response?.data?.message || error.message}`,
            });
            throw error;
        }
    };

    const viewSchema = async (migrate_table_id: number, task_id: number) => {
        try {
            const response = await api.get(`/tables/${migrate_table_id}/schema/?task_id=${task_id}`);
            return response.data;
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: `Failed to fetch schema: ${error?.response?.data?.message || error.message}`,
            });
            throw error;
        }
    };

    const startMigration = async (migrate_table_id: number, task_id: number) => {
        try {
            const response = await api.get(`/tables/${migrate_table_id}/sync/?task_id=${task_id}`);
            return response.data;
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: `Failed to start migration: ${error?.response?.data?.message || error.message}`,
            });
            throw error;
        }
    };

    const changeTaskStatus = async (task_id: number, status: string) => {
        try {
            const response = await api.get(`/tasks/${task_id}/change-task-status/?status=${status}`);
            return response.data;
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: `Failed to change task status: ${error?.response?.data?.message || error.message}`,
            });
            throw error;
        }
    };

    return {fetchTables, deleteTable, viewSchema, startMigration, changeTaskStatus};
};
