/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { toast } from '@/components/shadcn/toast';
import BrandLogo from '@/components/ui/BrandLogo';
import Loader from '@/components/ui/Loader';
import LoginForm from '@/features/auth/login/LoginForm';
import { SERVER_URL } from '@/lib/config/env';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubmitEvent, Suspense, useEffect, useState } from 'react'

export default function page() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginForm />
    </Suspense>
  );
}
