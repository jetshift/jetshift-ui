'use client'

import React, {useEffect} from 'react';
import {useLayout} from '@/components/providers/layout-provider';
import {EtlPieChart} from "@/components/dashboard/etl-pie-chart";

export default function DashboardPage() {
    const {setBreadcrumbItems, setRightSection} = useLayout();

    useEffect(() => {
        setBreadcrumbItems([
            {label: 'Home', href: '/'},
            {label: 'Dashboard'},
        ]);

        setRightSection(<span></span>);
    }, [setBreadcrumbItems, setRightSection]);

    return (
        <>
            <div className="grid auto-rows-min gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                <EtlPieChart title="Migration Tasks" type="migration"/>

                <EtlPieChart title="ETL Tasks" type="etl"/>

                <div className="aspect-video rounded-xl bg-muted/50"/>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
        </>
    );
}
