"use client";

import React, {Fragment} from "react";
import Link from "next/link";

import {AppSidebar} from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import {Button} from "@/components/ui/button";
import {Zap} from "lucide-react";

import {useLayout} from '@/components/providers/layout-provider';
import {useWebSocket} from '@/components/providers/web-socket-provider';

type AppLayoutProps = {
    user?: any;
    children: React.ReactNode;
};

export default function AppLayout(
    {
        user,
        children,
    }: AppLayoutProps) {
    const {breadcrumbItems, rightSection} = useLayout();
    const {sendMessage} = useWebSocket();

    const handleSendMessage = () => {
        sendMessage({message: "testws"});
    };

    return (
        <SidebarProvider>
            <AppSidebar user={user}/>
            <SidebarInset>
                <header className="flex h-16 items-center justify-between px-4 flex-wrap transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    {/* Left Section */}
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1"/>
                        <Separator orientation="vertical" className="mr-2 h-4"/>
                        <Breadcrumb>
                            <BreadcrumbList>
                                {breadcrumbItems.map((item, index) => (
                                    <Fragment key={index}>
                                        <BreadcrumbItem
                                            className={
                                                index < breadcrumbItems.length - 1
                                                    ? "hidden md:block"
                                                    : ""
                                            }
                                        >
                                            {item.href ? (
                                                <Link href={item.href}>{item.label}</Link>
                                            ) : (
                                                <span className="font-bold">{item.label}</span>
                                            )}
                                        </BreadcrumbItem>
                                        {index < breadcrumbItems.length - 1 && (
                                            <BreadcrumbSeparator className="hidden md:block"/>
                                        )}
                                    </Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 flex-wrap justify-end mt-2 sm:mt-0">
                        {user && <span className="text-sm text-muted-foreground">Hi, {user.name}</span>}

                        {rightSection}

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleSendMessage}
                            title={`Test WebSocket`}
                        >
                            <Zap/>
                        </Button>
                    </div>
                </header>

                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
            </SidebarInset>
        </SidebarProvider>
    );
}
