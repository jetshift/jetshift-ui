import {useToast} from "@/hooks/use-toast";
import {MigrateTable} from "@/types/migration";

export const useMigrationTables = () => {
    const {toast} = useToast();

    const fetchTables = async (type?: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/migrate/tables${type ? `?type=${type}` : ""}`);
        if (!response.ok) {
            toast({
                variant: "destructive",
                description: `Failed to fetch tables`,
            })
            throw new Error("Failed to fetch tables");
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
                config: task.config,
                stats: task.stats,
                deployment_id: task.deployment_id,
                error: task.error,
            })) || [],
            created_at: job.created_at,
            updated_at: job.updated_at,
        }));

        return mappedData;
    };

    const deleteTable = async (id: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/databases/delete/${id}`, {method: "POST"});
        if (!response.ok) {
            toast({
                variant: "destructive",
                description: `Failed to delete table`,
            })
            throw new Error("Failed to delete table");
        }
        return await response.json();
    };

    const startMigration = async (migrate_table_id: number, task_id: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/migrate/tables/${migrate_table_id}/migrate/?task_id=${task_id}`);
        if (!response.ok) {
            toast({
                variant: "destructive",
                description: `Failed to start migration`,
            })
        }
        return await response.json();
    };

    const viewSchema = async (migrate_table_id: number, task_id: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/migrate/tables/${migrate_table_id}/schema/?task_id=${task_id}`);
        if (!response.ok) {
            toast({
                variant: "destructive",
                description: `Failed to delete table`,
            })
            throw new Error("Failed to fetch schema");
        }
        return await response.json();
    };

    return {fetchTables, deleteTable, startMigration, viewSchema};
};
