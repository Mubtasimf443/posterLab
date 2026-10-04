/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
'use client'
import TemplateForm from '@/features/templates/TemplateForm'
import { SERVER_URL } from '@/lib/config/env'
import React from 'react'

export default function page() {
    async function handleSubmit(values:any) {
        try {
            let response = await fetch(`${SERVER_URL}/api/admin/templates` , {
                method : 'POST',
                body: JSON.stringify(values),
                headers : { 'content-type':'application/json'},
                credentials : 'include',
                cache : 'no-cache'
            });
            if (response.ok) {
                return true
            }
            console.log(await response.json());
            return false;
        } catch (error) {
            return false
        }
    }
    return (
        <TemplateForm
            onSubmit={handleSubmit}
        />
    )
}
