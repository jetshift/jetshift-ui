'use client'

import React, {useEffect} from "react";
import {useLayout} from '@/components/providers/layout-provider';
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button"
import ListUserComponent from "@/components/users/list";

export default function About() {
    const {setBreadcrumbItems, setRightSection} = useLayout();

    useEffect(() => {
        setBreadcrumbItems([
            {label: 'Home', href: '/'},
            {"label": "Users"},
        ]);

        setRightSection(
            <Link className={buttonVariants({variant: "outline"})} href={"/users/add"}>Add User</Link>
        );
    }, [setBreadcrumbItems, setRightSection]);

    return (
        <>
            <div>
                <ListUserComponent className="mt-2" />
            </div>
        </>
    );
}
