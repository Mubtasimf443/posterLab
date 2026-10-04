/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import CreatePosterForm from '@/features/posters/CreatePosterForm'
import React from 'react'

export default function page() {
  return (
    <div className='flex flex-col justify-start items-center h-dvh w-full gap-5 p-10'>
      <CreatePosterForm />
    </div>
  )
}
