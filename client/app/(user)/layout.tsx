/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

"use client"
import { SidebarProvider, SidebarTrigger } from '@/components/shadcn/sidebar';
import Loader from '@/components/ui/Loader';
import AccountSidebar from '@/features/account/AccountSidebar';
import { SERVER_URL } from '@/lib/config/env';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  let [isLoading, setIsLoading] = useState(true);
  const router= useRouter();

  useEffect(() => {
    (async function () {
      let response = await fetch(SERVER_URL+ '/api/auth/user-details', {
        credentials : 'include',
        cache : 'no-cache'
      });
      if (response.status=== 200) {
        setIsLoading(false)
      }
      else {
        router.push('/login')
      }
    })();
  }, []);

  if (isLoading) return <Loader />;
  
  return (
    <>
    <SidebarProvider>
                <AccountSidebar />
                <main className="flex-1">
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
      
    </>
  );
}
