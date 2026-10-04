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
} from '@/components/shadcn/sidebar';
import { ImagePlus, Images } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'


const posterItems = [
    { title: 'Create Poster', url: '/account/posters/create', icon: ImagePlus },
    { title: 'Poster List', url: '/account/posters', icon: Images },
]

export default function AccountSidebar() {
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
                        <SidebarGroupLabel className="text-lg">Posters</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {posterItems.map((item) => (
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

                    
                </SidebarContent>

                <SidebarFooter />
            </Sidebar>

    )
}
