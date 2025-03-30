'use client'

import Link from "next/link";
import {buttonVariants} from "@/components/ui/button"
import ListMigrationDatabase from "@/components/migrations/databases";
import React, {useEffect} from "react";
import {useLayout} from "@/components/providers/layout-provider";

export default function About() {

    const {setBreadcrumbItems, setRightSection} = useLayout();

    useEffect(() => {
        setBreadcrumbItems([
            {label: 'Home', href: '/'},
            {label: "Migrations", href: "#"},
            {label: "Databases"},
        ]);

        setRightSection(
            <Link className={buttonVariants({variant: "outline"})} href={"/migrations/databases/add"}>Add Task</Link>
        );
    }, [setBreadcrumbItems, setRightSection]);

    return (
        <>
            <div>
                <ListMigrationDatabase className="mt-2"/>
            </div>
        </>
    );
}
