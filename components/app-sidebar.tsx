"use client"

import * as React from "react"
import {
    DatabaseIcon,
    LayoutDashboardIcon,
    SendIcon,
    RefreshCcwIcon,
} from "lucide-react"

import {NavMain} from "@/components/nav-main"
// import {NavProjects} from "@/components/nav-projects"
import {NavUser} from "@/components/nav-user"
// import {TeamSwitcher} from "@/components/team-switcher"
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
            url: "/etl",
            icon: RefreshCcwIcon,
            isActive: true,
        },
    ],
    // projects: [
    //     {
    //         name: "Design Engineering",
    //         url: "#",
    //         icon: Database,
    //     },
    //     {
    //         name: "Sales & Marketing",
    //         url: "#",
    //         icon: Database,
    //     },
    //     {
    //         name: "Travel",
    //         url: "#",
    //         icon: Map,
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

                <NavMain items={data.navMain}/>
                {/*<NavProjects projects={data.projects}/>*/}
            </SidebarContent>
            <SidebarFooter>
                {user && <NavUser user={user}/>}
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
