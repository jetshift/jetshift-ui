export interface MigrationTask {
    id: number;
    migrate_table_id: number;
    source_table: string;
    target_table: string;
    status: string;
    config: {
        live_schema: boolean;
        primary_id: string;
        extract_offset: number;
        extract_limit: number;
        extract_chunk_size: number;
        truncate_table: boolean;
        load_chunk_size: number;
        sleep_interval: number;
    };
    stats: {
        total_source_items: number;
        total_target_items: number;
    };
    error: string;
}

export interface MigrateTable {
    id: number;
    title: string;
    source_db: string;
    target_db: string;
    status: string;
    logs: string;
    tasks: MigrationTask[];
    created_at: string;
    updated_at: string;
}
