'use client'

import React, {useEffect} from "react";
import {useLayout} from '@/components/providers/layout-provider';
import {buttonVariants} from "@/components/ui/button"
import Link from "next/link";
import ListTable from "@/components/migrations/table-components/migration-table";

export default function About() {
    const {setBreadcrumbItems, setRightSection} = useLayout();

    useEffect(() => {
        setBreadcrumbItems([
            {label: 'Home', href: '/'},
            {label: "ETL Tasks"},
        ]);

        setRightSection(
            <Link className={buttonVariants({variant: "outline"})} href={"/migrations/tables/add"}>Add Task</Link>
        );
    }, [setBreadcrumbItems, setRightSection]);

    return (
        <div>
            <ListTable className="mt-2" type="etl"/>
        </div>
    );
}
