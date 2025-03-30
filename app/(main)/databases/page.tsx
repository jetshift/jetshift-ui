'use client'

import React, {useEffect} from "react";
import {useLayout} from '@/components/providers/layout-provider';
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button"
import ListDatabase from "@/components/databases/list";

export default function About() {
    const {setBreadcrumbItems, setRightSection} = useLayout();

    useEffect(() => {
        setBreadcrumbItems([
            {label: 'Home', href: '/'},
            {"label": "Databases"},
        ]);

        setRightSection(
            <Link className={buttonVariants({variant: "outline"})} href={"/databases/add"}>Add Database</Link>
        );
    }, [setBreadcrumbItems, setRightSection]);

    return (
        <>
            <div>
                {/*<ListDatabase className="mt-2" type="source" />*/}
                <ListDatabase className="mt-2" />
            </div>

        </>
    );
}
