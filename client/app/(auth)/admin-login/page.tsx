/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { toast } from '@/components/shadcn/toast';
import BrandLogo from '@/components/ui/BrandLogo';
import Loader from '@/components/ui/Loader';
import AdminLoginForm from '@/features/auth/admin-login/AdminLoginForm';
import { SERVER_URL } from '@/lib/config/env';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitEvent, Suspense, useState } from 'react'

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <AdminLoginForm />
    </Suspense>
  );
}
