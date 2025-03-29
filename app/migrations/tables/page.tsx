'use client'

import Link from "next/link";
import AppLayout from "@/components/layouts/app-layout";
import {buttonVariants} from "@/components/ui/button"
import ListMigrationTable from "@/components/migrations/table-components/migration-table";
import React from "react";

export default function About() {
    return (
        <AppLayout
            breadcrumbItems={[
                {label: "Migrations", href: "/"},
                {label: "Tables"},
            ]}

            rightSection={
                <Link className={buttonVariants({variant: "outline"})} href={"/migrations/tables/add"}>Add Task</Link>
            }
        >
            <div>
                <ListMigrationTable className="mt-2" type="migration" />
            </div>

        </AppLayout>
    );
}
