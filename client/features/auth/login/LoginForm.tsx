/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { toast } from '@/components/shadcn/toast';
import BrandLogo from '@/components/ui/BrandLogo';
import { SERVER_URL } from '@/lib/config/env';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function LoginForm() {
 let router = useRouter();
  let [email, setEmail] = useState('');
  let [password, setpassword] = useState('');
  let [isSubmitingForm, setIsSubmitingForm] = useState<boolean>(false);
  const searchParams = useSearchParams();
 
  useEffect(() => {
    console.log(searchParams.get('registration_success') === 'yes' );
    
    if (searchParams.get('registration_success') === 'yes') {
      alert('You have successfully created an account. Now Please Login');
    }
  }, []);
  async function HandleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitingForm) return; // stop double submits

    setIsSubmitingForm(true);
    try {
      const response = await fetch(`${SERVER_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // required so the login_session cookie is stored
        body: JSON.stringify({ email: email.trim(), password }),
        cache: 'no-cache',
      });

      if (response.ok) {
        router.push('/account');
        router.refresh(); // re-run server components with the new cookie
        return;
      }

     
      if (response.status >= 500) {
        toast.add({
          title: 'Server error',
          description: 'Something went wrong on our side. Please try again in a moment.',
        });
      } else {
        toast.add({
          title: 'Login failed',
          description: 'Please check your email and password and try again.',
        });
      }
    } catch (error) {
      // Network failure, CORS error, server offline
      console.error(error);
      toast.add({
        title: 'Failed to login',
        description: 'We could not reach the server. Check your connection and try again.',
      });
    } finally {
      setIsSubmitingForm(false);
    }
  }
  return (
    <div className='flex flex-col justify-center items-center min-h-dvh w-full px-4 py-6 sm:py-10'>
      <h2 className="text-2xl sm:text-3xl font-semibold py-3 sm:py-5 text-center">Please Login</h2>
      <form
        onSubmit={(event) => HandleFormSubmit(event)}
        className='flex flex-col justify-start items-center shadow-md py-6 px-6 sm:py-10 sm:px-10 w-full max-w-md min-h-fit border-2 border-[#1c409571] rounded-lg'
      >
        <BrandLogo width={120} height={120} />
        <div className="flex flex-col justify-start items-center w-full gap-y-2 mb-2 mt-2">
          <label htmlFor="email-input" className='w-full font-medium text-base sm:text-lg'>Email</label>
          <input
            className='w-full rounded-md border-1 border-[#1c409571] p-2.5 sm:p-3 text-base outline-none bg-[#1c409513]'
            name='email'
            type="email"
            id="email-input"
            minLength={7}
            maxLength={255}
            autoComplete={'off'}
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col justify-start items-center w-full gap-y-2 mb-2">
          <label htmlFor="password-input" className='w-full font-medium text-base sm:text-lg'>Password</label>
          <input
            className='w-full rounded-md border-1 border-[#1c409571] p-2.5 sm:p-3 text-base outline-none bg-[#1c409513]'
            name='password'
            type="password"
            id="password-input"
            minLength={7}
            maxLength={255}
            autoComplete={'off'}
            value={password}
            onChange={event => setpassword(event.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className='w-full bg-primary cursor-pointer disabled:opacity-50 text-white p-2.5 sm:p-2 text-base sm:text-lg rounded-sm my-2'
          disabled={isSubmitingForm}
        >
          Login
        </button>
        <span className="text-sm text-gray-700 py-2 text-center">
          Don't Have a Account{' '}
          <Link className='text-primary' href={'/register'}>Sign Up</Link>
        </span>
      </form>
    </div>
  )
}
