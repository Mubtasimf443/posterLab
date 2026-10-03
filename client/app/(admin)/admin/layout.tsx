/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import Loader from '@/components/ui/Loader';
import { SERVER_URL } from '@/lib/config/env';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    let [loading, setLoading] = useState(true);
    let router = useRouter();
    useEffect(() => {
        (async function () {
            let response = await fetch(SERVER_URL + '/api/auth/is-admin', {
                cache : 'no-cache',
                credentials : 'include'
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
        <div>
            {children}
        </div>
    )
}
