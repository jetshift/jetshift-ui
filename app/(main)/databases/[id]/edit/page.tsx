'use client'

import {useEffect, useState} from "react";
import {useLayout} from '@/components/providers/layout-provider';
import AddEditDatabase from "@/components/databases/add-edit-database";
import api from "@/lib/api";
import {useToast} from "@/hooks/use-toast";
import {DatabaseFormData} from "@/types/migration";

interface EditDatabasePageProps {
    params: { id: string };
}

export default function EditDatabasePage({params}: EditDatabasePageProps) {
    const {id} = params;

    const {toast} = useToast()
    const {setBreadcrumbItems, setRightSection} = useLayout();
    const [database, setDatabase] = useState<Partial<DatabaseFormData> | null>(null);

    const fetchDatabase = async () => {
        try {
            const response = await api.get(`/databases/${id}`);
            const data = response.data;
            setDatabase(data.data || {});
        } catch (error) {
            toast({
                variant: "destructive",
                description: `Error fetching database: ${error}`,
            });
        }
    };

    useEffect(() => {
        setBreadcrumbItems([
            {label: 'Home', href: '/'},
            {label: "Databases", href: "/databases"},
            {label: "Edit"},
        ]);

        setRightSection(<span></span>);

        fetchDatabase();
    }, [setBreadcrumbItems, setRightSection]);

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
                <div className="flex w-full max-w-lg flex-col gap-6">
                    {database && (
                        <AddEditDatabase initialData={database} isEdit={true}/>
                    )}
                </div>
            </div>
        </>
    );
}
