'use client'

import {useEffect} from 'react';
import {useLayout} from '@/components/providers/layout-provider';

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
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50"/>
                <div className="aspect-video rounded-xl bg-muted/50"/>
                <div className="aspect-video rounded-xl bg-muted/50"/>
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"/>
        </>
    );
}
