/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarProvider, SidebarTrigger } from '@/components/shadcn/sidebar';
import Loader from '@/components/ui/Loader';
import AdminSideBar from '@/features/admin/AdminSideBar';
import { SERVER_URL } from '@/lib/config/env';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    let [loading, setLoading] = useState(true);
    let router = useRouter();
    useEffect(() => {
        (async function () {
            let response = await fetch(SERVER_URL + '/api/auth/is-admin', {
                cache: 'no-cache',
                credentials: 'include'
            });
            if (response.ok) {
                setLoading(false);
            } else {
                router.push('/admin-login');
                router.refresh();
                return;
            }
        })();
    }, []);

    if (loading) {
        return <Loader />
    }

    return (
        <div className=" w-dvw flex flex-row justify-start items-start gap-2">
            <SidebarProvider>
                <AdminSideBar />
                <main className="flex-1">
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
            
        </div>
    )
}
