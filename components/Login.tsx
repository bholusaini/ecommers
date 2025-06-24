'use client'
import { Button, Card, Divider, Form, Input } from 'antd'
import Image from 'next/image'
import React from 'react'
import { ArrowRightOutlined, GoogleOutlined } from '@ant-design/icons'
import '@ant-design/v5-patch-for-react-19';
import Link from 'next/link'
import Logo from './shared/logo'
import { getSession, signIn } from 'next-auth/react'

import ClientCatchError from '@/Lib/client-catch-error'
import { useRouter } from 'next/navigation'


const Login= () => {
    const router = useRouter()
    const login = async  (value: any)=>{
      try{
          const payload = {
           ...value,
            redirect:false,
            
        }

        const res =  await signIn('credentials',payload)

        if (!res || !res.ok) {
           throw new Error("Invalid email or password");
           }

        const session = await getSession() 

        console.log(session)
       
        if(!session)
            throw new Error("faild to login user")
       
        if(session.user.role === "user")
            return router.replace("/user/orders")

        if(session.user.role === "admin")
            return router.replace("/admin/orders")
      }
      catch(err)
      {
        ClientCatchError(err)
      }
        
      
    }

    return (
        <div className='bg-gray-100 h-screen grid grid-cols-2 animated__animated animate__fadeIn overflow-hidden'>
            <div className='relative'>
                <Image 
                    src="/images/signup.jpg"
                    fill
                    alt="signup"
                    className='object-cover'
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                />
            </div>
            <div className='flex items-center justify-center'>
                <Card className='w-[480px] animate__animated animate__slideInRight'>
                    <div className='space-y-4'>
                        <div className='flex justify-center'>
                            <Logo />
                        </div>
                        <Form layout='vertical' onFinish={login}>
                            <Form.Item 
                                label="Email"
                                name="email"
                                rules={[{required: true, type: 'email'}]}
                            >
                                <Input size='large' placeholder='email@example.com' />
                            </Form.Item>

                            <Form.Item 
                                label="Password"
                                name="password"
                                rules={[{required: true}]}
                            >
                                <Input.Password size='large' placeholder='email@example.com' />
                            </Form.Item>

                            <Form.Item>
                                <Button htmlType='submit' size='large' type="primary" icon={<ArrowRightOutlined />} className='!bg-violet-500 hover:!bg-violet-600'>Sign in</Button>
                            </Form.Item>
                        </Form>
                        <Divider />
                        <Button icon={<GoogleOutlined />} size='large' className='!w-full' type="primary" danger>Signin with Google</Button>
                        <div className='flex gap-2'>
                            <p className='text-gray-500'>Don`t have an acount ?</p>
                            <Link href="/signup">Sign up</Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Login