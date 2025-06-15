import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div>
      <Image
        src="/images/logo.jpg"
        alt="Logo"
        width={50}
        height={0}
   
      />
    </div>
  )
}

export default Logo
