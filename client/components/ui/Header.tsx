/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import React from 'react'
import BrandLogo from './BrandLogo'
import Link from 'next/link'

export default function Header() {
  return (
    <header className=' flex flex-row items-center justify-between h-13 px-5 shadow-sm'>
        <BrandLogo width={100} height={100}/>
        
    </header>
  )
}
