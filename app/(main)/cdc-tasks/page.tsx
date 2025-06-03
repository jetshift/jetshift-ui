'use client'

import React, {useEffect} from "react";
import {useLayout} from '@/components/providers/layout-provider';
import {buttonVariants} from "@/components/ui/button"
import Link from "next/link";
import ListTable from "@/components/tasks/list";

export default function About() {
    const {setBreadcrumbItems, setRightSection} = useLayout();

    useEffect(() => {
        setBreadcrumbItems([
            {label: 'Home', href: '/'},
            {label: "CDC Tasks"},
        ]);

        setRightSection(
            <Link className={buttonVariants({variant: "outline"})} href={"/cdc-tasks/add"}>Add Task</Link>
        );
    }, [setBreadcrumbItems, setRightSection]);

    return (
        <div>
            <ListTable className="mt-2" type="cdc"/>
        </div>
    );
}
