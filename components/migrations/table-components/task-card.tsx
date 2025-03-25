import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {MigrationTask} from "@/types/migration";

export default function TaskCard(
    {
        task,
        onMigrate,
        onViewSchema,
        onStopMigration,
    }: {
        task: MigrationTask;
        onMigrate: () => void;
        onViewSchema: () => void;
        onStopMigration?: () => void;
    }) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>{task.source_table} ➔ {task.target_table}</CardTitle>
                <p>Status: {task.status}</p>
            </CardHeader>
            <CardContent>
                <p><span className="font-medium">Extract Chunk Size:</span> {task.config?.extract_chunk_size ?? 'N/A'}</p>
                <p><span className="font-medium">Total Source Items:</span> {task.stats?.total_source_items ?? 0}</p>
                <p><span className="font-medium">Total Target Items:</span> {task.stats?.total_target_items ?? 0}</p>

                {task.error
                    ? <p className="text-red-500 mt-2">Error: {task.error}</p>
                    : <p className="text-green-600 mt-2">No errors</p>}
            </CardContent>

            <CardFooter className="flex justify-between space-x-2">
                <Button variant="outline" onClick={onViewSchema}>View Schema</Button>

                {task.status === 'pending' && (
                    <Button onClick={onMigrate}>
                        Migrate
                    </Button>
                )}

                {task.status === 'migrating' && (
                    <Button variant="destructive" onClick={onStopMigration}>
                        Stop
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
