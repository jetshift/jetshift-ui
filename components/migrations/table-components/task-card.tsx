import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {MigrationTask} from "@/types/migration";

export default function TaskCard({task, onMigrate, onViewSchema}: { task: MigrationTask; onMigrate: () => void; onViewSchema: () => void; }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{task.source_table} ➔ {task.target_table}</CardTitle>
                <p>Status: {task.status}</p>
            </CardHeader>
            <CardContent>
                {task.error ? <p className="text-red-500">Error: {task.error}</p> : <p>No errors</p>}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onViewSchema}>View Schema</Button>
                <Button onClick={onMigrate}>Migrate</Button>
            </CardFooter>
        </Card>
    );
}
