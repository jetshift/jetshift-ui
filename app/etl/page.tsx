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
                {label: "ETL Tasks"},
            ]}

            rightSection={
                <Link className={buttonVariants({variant: "outline"})} href={"/migrations/tables/add"}>Add Job</Link>
            }
        >
            <div>
                <ListMigrationTable className="mt-2" type="etl" />
            </div>

        </AppLayout>
    );
}
