"use client"

import * as React from "react"
import {
    DatabaseIcon,
    LayoutDashboardIcon,
    SendIcon,
    RefreshCcwIcon,
    DatabaseBackupIcon,
    UsersIcon
} from "lucide-react"

import {NavMain} from "@/components/nav-main"
import {NavUser} from "@/components/nav-user"
import {NavJetShift} from "@/components/nav-jetshift";
import {
    SidebarGroup,
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarFooter,
    SidebarHeader, SidebarMenuButton, SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

import Link from 'next/link'

// Data
const data = {
    navMain: [
        {
            title: "Databases",
            url: "/databases",
            icon: DatabaseIcon,
            isActive: true,
        },
        {
            title: "Migrations",
            url: "#",
            icon: SendIcon,
            isActive: true,
            items: [
                {
                    title: "Databases",
                    url: "/migrations/databases",
                },
                {
                    title: "Tables",
                    url: "/migrations/tables",
                },
            ],
        },
        {
            title: "ETL Tasks",
            url: "/etl-tasks",
            icon: RefreshCcwIcon,
            isActive: true,
        },
        {
            title: "CDC Tasks",
            url: "/cdc-tasks",
            icon: DatabaseBackupIcon,
            isActive: true,
        },
    ],
    adminItems: [
        {
            title: "Users",
            url: "/users",
            icon: UsersIcon,
            isActive: true,
        },
    ],
    // projects: [
    //     {
    //         name: "Design Engineering",
    //         url: "#",
    //         icon: RefreshCcwIcon,
    //     },
    //     {
    //         name: "Sales & Marketing",
    //         url: "#",
    //         icon: RefreshCcwIcon,
    //     },
    //     {
    //         name: "Travel",
    //         url: "#",
    //         icon: RefreshCcwIcon,
    //     },
    // ],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    user?: any;
};

export function AppSidebar({user, ...props}: AppSidebarProps) {

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavJetShift/>
            </SidebarHeader>
            <SidebarContent>

                {/* Dashboard */}
                <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link href="/">
                                <SidebarMenuButton tooltip='sss'>
                                    <LayoutDashboardIcon/>
                                    <span>Dashboard</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <NavMain items={data.navMain} menuTitle={'Menu'}/>

                {user.is_superuser &&
                  <NavMain items={data.adminItems} menuTitle={'Admin'}/>
                }

                {/*<NavProjects projects={data.projects}/>*/}
            </SidebarContent>
            <SidebarFooter>
                {user && <NavUser user={user}/>}
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
