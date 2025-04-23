interface UserInterface {
    id: number;
    name?: string;
    first_name: string;
    last_name: string;
    username: string;
    email: number;
    is_superuser: boolean;
    is_active: boolean;
    date_joined?: string;
}

interface DatabaseInterface {
    id?: number;
    type: string;
    dialect: string;
    title: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

interface MigrateDatabaseInterface {
    id?: number;
    title: string;
    source_db: string;
    target_db: string;
    status: boolean;
    logs: string;
    created_at?: string;
    updated_at?: string;
}

export interface TaskInterface {
    id?: number;
    type?: string;
    title: string;
    source_db?: number;
    target_db?: number;
    status: string;
    logs: string;
    subtasks?: SubTaskInterface[];
    created_at?: string;
    updated_at?: string;
}

export interface SubTaskInterface {
    id?: number;
    task?: string;
    source_table: string;
    target_table: string;
    status: string;
    config?: {
        live_schema?: boolean;
        primary_id?: string;
        extract_offset?: number;
        extract_limit?: number;
        extract_chunk_size?: number;
        truncate_table?: boolean;
        load_chunk_size?: number;
        sleep_interval?: number;
    };
    stats?: {
        total_source_items: number;
        total_target_items: number;
    };
    deployment_id?: string;
    cron?: string;
    error: string;
}
