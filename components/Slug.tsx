'use client'
import DataInterface from '@/interface/data.interface'
import priceCalculate from '@/lib/price-calculate'
import { Card, Empty } from 'antd'
import Image from 'next/image'
import React, { FC } from 'react'
import '@ant-design/v5-patch-for-react-19';
import Pay from './shared/Pay'
import { useRouter } from 'next/navigation'

interface TitleInterface extends DataInterface {
  title: string
}

const Slug: FC<TitleInterface> = ({data, title}) => {
  const router = useRouter()

  if(!data)
    return <Empty />
  
  return (
    <div>
      <Card className='shadow-lg'>
        <div className='flex gap-12'>
          <Image 
            src={data.image}
            width={240}
            height={0}
            alt={data.title}
            className='rounded-lg object-cover'
          />
          <div>
              <h1 className='text-4xl font-bold'>{data.title}</h1>
              <p className='text-slate-500 mt-2'>{data.description}</p>
              <div className='text-3xl font-medium flex gap-4 mt-5 mb-5'>
                <h1>₹{priceCalculate(data.price, data.discount)}</h1>
                <del className='text-slate-400'>₹{data.price}</del>
                <h1 className='text-rose-500'>({data.discount}% Discount)</h1>
              </div>
              <div className='w-[200px]'>
                <Pay 
                  title='Buy now'
                  product={data} 
                  onSuccess={()=>router.push('/user/orders')}
                />
              </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Slug