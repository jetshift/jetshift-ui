'use client'

import Link from "next/link";
import {buttonVariants} from "@/components/ui/button"
import ListMigrationTable from "@/components/migrations/table-components/migration-table";
import React, {useEffect} from "react";
import {useLayout} from "@/components/providers/layout-provider";

export default function About() {
    const {setBreadcrumbItems, setRightSection} = useLayout();

    useEffect(() => {
        setBreadcrumbItems([
            {label: 'Home', href: '/'},
            {label: "Migrations", href: "#"},
            {label: "Tables"},
        ]);

        setRightSection(
            <Link className={buttonVariants({variant: "outline"})} href={"/migrations/tables/add"}>Add Task</Link>
        );
    }, [setBreadcrumbItems, setRightSection]);

    return (
        <>
            <div>
                <ListMigrationTable className="mt-2" type="migration"/>
            </div>
        </>
    );
}
