'use client'

import React, {useEffect, useRef, useState} from "react";
import {useLayout} from '@/components/providers/layout-provider';
import {DatabaseInterface} from "@/types/migration";
import AddEditSubTaskComponent from "@/components/tasks/add-edit-sub-task";
import {subTaskService} from "@/lib/services/subtask-service";

interface EditDatabasePageProps {
    params: { id: string };
}

export default function EditDatabasePage({params}: EditDatabasePageProps) {
    const {id} = params;
    const subTaskId = parseInt(id, 10);

    const {setBreadcrumbItems, setRightSection} = useLayout();

    const isFetchedSubTask = useRef(false);
    const [loading, setLoading] = useState(true);
    const {getSubTaskById} = subTaskService();
    const [subTask, setSubTask] = useState<Partial<DatabaseInterface> | null>(null);

    const fetchSubTask = async () => {
        try {
            const data = await getSubTaskById(subTaskId);
            if (data) setSubTask(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setBreadcrumbItems([
            {label: 'Home', href: '/'},
            {label: "CDC Tasks", href: "/cdc-tasks"},
            {label: "Edit Sub Task"},
        ]);

        setRightSection(<span></span>);

        if (!isFetchedSubTask.current) {
            isFetchedSubTask.current = true;
            fetchSubTask();
        }
    }, [setBreadcrumbItems, setRightSection]);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
                <div className="flex w-full max-w-lg flex-col gap-6">
                    {subTask && (
                        <AddEditSubTaskComponent type={`cdc`} initialData={subTask} isEdit={true}/>
                    )}
                </div>
            </div>
        </>
    );
}
