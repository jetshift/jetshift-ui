import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import React from "react";
import {cn} from "@/lib/utils";
import {FolderOpenIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function SchemaViewer({open, onOpenChange, schemaData, onViewSchema, task}: any) {
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
                                        {schemaData.target.schema.length === 0 ? (
                                            <div className={cn("flex flex-col items-center justify-center text-center py-20 space-y-4")}>
                                                <FolderOpenIcon className="w-12 h-12 text-muted-foreground"/>
                                                <p className="text-muted-foreground text-sm">No data available</p>
                                                <p className="text-muted-foreground text-sm">Do you want to auto create table?</p>

                                                <Button variant="default" onClick={() => onViewSchema(task)}>
                                                    Yes Create
                                                </Button>
                                            </div>
                                        ) : (
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
                                        )}
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
