/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */
"use client"
import { Button } from '@/components/shadcn/button';
import { Dialog, DialogHeader, DialogTitle } from '@/components/shadcn/dialog';
import CreatePosterForm from '@/features/posters/CreatePosterForm'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function page() {
  let [posterUrl, setPosterUrl] = useState('');
  let [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!!posterUrl) setIsDialogOpen(true);
    else setIsDialogOpen(false);
  }, [posterUrl])
  return (
    <div className='flex flex-col justify-start items-center h-dvh w-full gap-5 p-10'>
      <CreatePosterForm setPosterUrl={setPosterUrl}/>
      {!!posterUrl &&
        <Dialog open={isDialogOpen}>
          <DialogHeader className=' flex flex-row justify-between items-center w-full'>
            <DialogTitle >You Poster</DialogTitle>
            <button className='text-sm text-black' onClick={() => setPosterUrl('')}>&times;</button>
          </DialogHeader>
          <Image src={posterUrl} alt='poster' width={200} height={200} />
          <Button variant={'default'} >
            <a href={posterUrl} download={true} className=' no-underline text-inherit text-sm'>Download</a>
          </Button>
        </Dialog>
      }
    </div>
  )
}
