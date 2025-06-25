"use client"
import { SessionProvider } from 'next-auth/react'
import React, { Children, FC } from 'react'
import Layout from './Layout'
import ChildrenInterface from '../interface/Children.interface'


const MainProvider: FC<ChildrenInterface> = ({children}) => {
  return (
    <div>
     <SessionProvider>
     <Layout>
        {children}
     </Layout>
     </SessionProvider>
    </div>
  )
}

export default MainProvider