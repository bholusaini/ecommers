'use client'
import { Card, Select, Skeleton } from 'antd'
import React from 'react'
import Image from 'next/image'
import useSWR, { mutate } from 'swr'
import fetcher from '@/lib/fetcher'
import moment from 'moment'
import axios from 'axios'
import clientCatchError from '../../lib/client-catch-error'

const Users = () => {
  const {data, error, isLoading} = useSWR('/api/user', fetcher)

   const changeRole = async (role: string, userId: string)=>{
    try {
      await axios.put(`/api/user/role/${userId}`, {role})
      mutate("/api/user")
    }
    catch(err)
    {
      clientCatchError(err)
    }
  }

  if(isLoading)
    return <Skeleton active />

  if(error)
    return <h1 className='text-rose-500 font-medium'>{error.message}</h1>
  
  return (
    <div className='grid lg:grid-cols-4 gap-8'>
      {
        data.map((item: any, index: number)=>(
          <Card key={index} hoverable>
            <div className='flex flex-col items-center gap-6'>
              <Image 
                src="/images/avt.avif"
                width={100}
                height={100}
                alt={`avt-${index}`}
                className='rounded-full'
                objectFit='cover'
              />
              <Card.Meta 
                title={<label className='capitalize'>{item.fullname}</label>}
                description={item.email}
              />

              <Select className='!w-fit !text-center' defaultValue={item.role} size='large' onChange={(role:string)=>changeRole(role,item.id) }>
               <Select.Option value="user">User</Select.Option>
               <Select.Option value="admin">Admin</Select.Option>
              </Select>

              <label className='text- gray-500 font-medium'>
                { moment(item.createdAt).format('MMM DD, YYYY hh:mm A') }
              </label>
            </div>
          </Card>
        ))
      }
    </div>
  )
}

export default Users