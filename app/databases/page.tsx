'use client'

import Link from "next/link";
import AppLayout from "@/components/layouts/app-layout";
import {buttonVariants} from "@/components/ui/button"
import ListDatabase from "@/components/databases/list";
import React from "react";

export default function About() {
    return (
        <AppLayout
            breadcrumbItems={[
                {"label": "Databases"},
            ]}

            rightSection={
                <Link className={buttonVariants({variant: "outline"})} href={"/databases/add"}>Add Source</Link>
            }
        >
            <div>
                {/*<ListDatabase className="mt-2" type="source" />*/}
                <ListDatabase className="mt-2" />
            </div>

        </AppLayout>
    );
}
