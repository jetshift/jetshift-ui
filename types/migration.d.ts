export interface MigrationTask {
    id: number;
    migrate_table_id: number;
    source_table: string;
    target_table: string;
    status: string;
    error: string;
}

export interface MigrateTable {
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
