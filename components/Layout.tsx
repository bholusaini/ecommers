'use client'

import { AntdRegistry } from '@ant-design/nextjs-registry'
import React, { FC } from 'react'
import 'animate.css'

import Link from 'next/link'
import { LoginOutlined, ProfileOutlined, SettingOutlined, UserAddOutlined } from '@ant-design/icons'
import { usePathname } from 'next/navigation'
import ChildrenInterface from '../interface/Children.interface'
import Logo from './shared/logo'
import { Avatar, Dropdown } from 'antd'
import { useSession } from 'next-auth/react'

const menus = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Products',
    href: '/products'
  },
  {
    label: 'Carts',
    href: '/carts'
  },
  {
    label: 'Sign in',
    href: '/login'
  }
]

  const acountMenu = {
    items: [
      {
        icon: <ProfileOutlined />,
        label: <a>bk sarswal</a>,
        key: 'fullname'
      },
      {
        icon: <LoginOutlined />,
        label: <a>Logout</a>,
        key: 'logout'
      },
      {
        icon: <SettingOutlined />,
        label: <a>Settings</a>,
        key: 'settings'
      }
    ]
  }

const Layout: FC<ChildrenInterface> = ({children}) => {
  const pathname = usePathname()
  const session = useSession()
 
  
  const blacklists = [
    "/admin",
    "/login",
    "/signup",
    "/user"
  ]

  const isBlacklist = blacklists.some((path)=>pathname.startsWith(path))

  if(isBlacklist)
  return (
    <AntdRegistry>
      <div>{children}</div>
    </AntdRegistry>
  )

  return (
    <AntdRegistry>
        <nav className='bg-white shadow-lg px-12 sticky top-0 left-0 flex justify-between items-center z-10'>
            <Logo />
            <div className='flex items-center text-black '>
                {
                  menus.map((item, index)=>(
                    <Link key={index} href={item.href} className='py-6 px-12 hover:bg-blue-500 hover:text-white'>
                      {item.label}
                    </Link>
                  ))
                }
            </div>
            <Link href="/signup" className='py-6 px-12 hover:bg-blue-500 hover:text-white bg-rose-500 text-white font-medium'>
              <UserAddOutlined className='mr-2' />
              Sign up
            </Link>
               <div>
              <Dropdown menu={acountMenu}>
                <Avatar 
                  size="large" 
                  src="/images/avt.avif"  
                />
              </Dropdown>
            </div>
        </nav>
        <div className='w-9/12 mx-auto py-24'>{children}</div>
        <footer className='bg-zinc-900 h-[450px] flex items-center justify-center text-white text-4xl '>
            <h1>My Footer !</h1>
        </footer>
    </AntdRegistry>
  )
}

export default Layout