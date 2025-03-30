'use client'

import {useEffect} from "react";
import {useLayout} from '@/components/providers/layout-provider';
import AddDatabase from "@/components/databases/add-database";

export default function About() {
    const {setBreadcrumbItems, setRightSection} = useLayout();

    useEffect(() => {
        setBreadcrumbItems([
            {label: 'Home', href: '/'},
            {label: "Databases", href: "/databases"},
            {label: "Add"},
        ]);

        setRightSection(<span></span>);
    }, [setBreadcrumbItems, setRightSection]);

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
                <div className="flex w-full max-w-lg flex-col gap-6">
                    {/*<AddDatabase type="target"/>*/}
                    <AddDatabase/>
                </div>
            </div>
        </>
    );
}
