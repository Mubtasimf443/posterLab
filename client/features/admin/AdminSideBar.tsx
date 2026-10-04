/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/shadcn/sidebar'
import { FilePlus, LayoutTemplate, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const templateItems = [
    { title: 'Create Template', url: '/admin/templates/create', icon: FilePlus },
    { title: 'Template List', url: '/admin/templates', icon: LayoutTemplate },
]

const userItems = [
    { title: 'User List', url: '/admin/users', icon: Users },
]

export default function AdminSideBar() {
    return (
        <Sidebar collapsible="icon">
            {/* Logo + Title */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <Link href="/admin" className="flex flex-row justify-start items-center">
                                <Image
                                    src="/images/mainLogo.png"
                                    alt="PosterLab logo"
                                    width={32}
                                    height={50}
                                    className='object-center object-contain'
                                />
                                {/* Hidden when the sidebar is collapsed to icons */}
                                <Image
                                    src="/images/headerLogo.png"
                                    alt="PosterLab"
                                    width={130}
                                    height={52}
                                    className="group-data-[collapsible=icon]:hidden"
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Templates group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg">Templates</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {templateItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton tooltip={item.title}>
                                        <Link href={item.url} className='flex flex-row justify-start items-center gap-2'>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Users group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-lg">Users</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {userItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton tooltip={item.title}>
                                        <Link href={item.url}  className='flex flex-row justify-start items-center gap-2'>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter />
        </Sidebar>
    )
}