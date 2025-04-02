import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export default function SchemaViewer({open, onOpenChange, schemaData}: any) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side={"bottom"}>
                <SheetHeader>
                    <SheetTitle>Schema Details</SheetTitle>
                    <SheetDescription>
                        {schemaData ? (
                            <div>
                                <Tabs defaultValue="source_schema" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="source_schema">{schemaData.source.database} - {schemaData.source.table}</TabsTrigger>
                                        <TabsTrigger value="target_schema">{schemaData.target.database} - {schemaData.target.table}</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="source_schema">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Field</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Nullable</TableHead>
                                                    <TableHead>Primary Key</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {schemaData.source.schema.map((col: any) => (
                                                    <TableRow key={col.name}>
                                                        <TableCell>{col.name}</TableCell>
                                                        <TableCell>{col.type}</TableCell>
                                                        <TableCell>{col.nullable ? "Yes" : "No"}</TableCell>
                                                        <TableCell>{col.primary_key ? "Yes" : "No"}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TabsContent>
                                    <TabsContent value="target_schema">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Field</TableHead>
                                                    <TableHead>Type</TableHead>
                                                    <TableHead>Nullable</TableHead>
                                                    <TableHead>Primary Key</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {schemaData.target.schema.map((col: any) => (
                                                    <TableRow key={col.name}>
                                                        <TableCell>{col.name}</TableCell>
                                                        <TableCell>{col.type}</TableCell>
                                                        <TableCell>{col.nullable ? "Yes" : "No"}</TableCell>
                                                        <TableCell>{col.primary_key ? "Yes" : "No"}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        ) : (
                            "Loading schema..."
                        )}
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
