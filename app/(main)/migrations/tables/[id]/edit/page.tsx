'use client'

import React, {useEffect, useRef, useState} from "react";
import {useLayout} from '@/components/providers/layout-provider';
import {DatabaseInterface} from "@/types/migration";
import {taskService} from "@/lib/services/task-service";
import AddEditTaskComponent from "@/components/tasks/add-edit-task";

interface EditDatabasePageProps {
    params: { id: string };
}

export default function EditDatabasePage({params}: EditDatabasePageProps) {
    const {id} = params;
    const subTaskId = parseInt(id, 10);

    const {setBreadcrumbItems, setRightSection} = useLayout();

    const isFetchedTask = useRef(false);
    const [loading, setLoading] = useState(true);
    const {getTaskById} = taskService();
    const [task, setTask] = useState<Partial<DatabaseInterface> | null>(null);

    const fetchTask = async () => {
        try {
            const data = await getTaskById(subTaskId);
            if (data) setTask(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setBreadcrumbItems([
            {label: 'Home', href: '/'},
            {label: 'Migrations', href: '/'},
            {label: "Tables", href: "/migrations/tables"},
            {label: "Edit"},
        ]);

        setRightSection(<span></span>);

        if (!isFetchedTask.current) {
            isFetchedTask.current = true;
            fetchTask();
        }
    }, [setBreadcrumbItems, setRightSection]);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
                <div className="flex w-full max-w-lg flex-col gap-6">
                    {task && (
                        <AddEditTaskComponent type={`migration`} initialData={task} isEdit={true}/>
                    )}
                </div>
            </div>
        </>
    );
}
