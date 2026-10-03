/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import Image from 'next/image'

interface IProps {
    width? : number;
    height?: number;
}

export default function BrandLogo({width, height}:IProps) {
  return (
    <Image width={width || 50} height={height || 50} src={'/images/headerLogo.png'} alt='Logo' />
  )
}
