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
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/",
        // avatar: "/avatars/shadcn.jpg",
    },
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

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
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
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
