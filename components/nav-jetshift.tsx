"use client"

import * as React from "react"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import Image from 'next/image'
import JSLogo from '../public/img/jetshift.png'

export function NavJetShift() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="flex aspect-square size-8 items-center justify-center">
                        <Image
                            src={JSLogo}
                            alt="JetShift"
                            title={"JetShift"}
                        />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      JetShift
                    </span>
                        <span className="truncate text-xs">jetshift@obydu.me</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
