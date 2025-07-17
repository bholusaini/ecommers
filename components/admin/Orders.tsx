'use client'

import { Avatar, Card, message, Select, Skeleton, Table, Tag } from 'antd'
import { title } from 'process'
import React from 'react'
import moment from 'moment'
import useSWR, { mutate } from 'swr'
import fetcher from '@/lib/fetcher'
import clientCatchError from '@/lib/client-catch-error'
import axios from 'axios'
import '@ant-design/v5-patch-for-react-19';
import priceCalculate from '@/lib/price-calculate'
import Image from 'next/image'

const Orders = () => {

  const {data, error, isLoading} = useSWR('/api/order', fetcher)

  console.log(data)

  if(isLoading)
    return <Skeleton active />

  if(error)
    return <h1 className='text-rose-500 font-medium'>{error.message}</h1>

  const changeStatus = async (status: string, id:string)=>{
    try {
      await axios.put(`/api/order/${id}`, {status})
      message.success(`Product status changed to ${status}`)
      mutate("/api/order")
    }
    catch(err)
    {
      clientCatchError(err)
    }
  }

  const getTotalSales = (item: any)=>{
    let sum = 0
    for(let i=0;i<item.prices.length; i++)
    {
      const price = item.prices[i]
      const discount = item.discounts[i]
      const qnt = item.quantities[i]
      const total = priceCalculate(price, discount) * qnt
      sum = sum+total
    }
    
    return <label>₹{sum.toLocaleString()}</label>
  }


  const columns = [
    {
      title: 'Order ID',
      key: 'orderId',
      dataIndex: 'orderId'
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (item: any)=>(
        <div className='flex gap-3'>
          <Avatar size="large" className='!bg-orange-500'>{item.user.fullname[0].toUpperCase()}</Avatar>
          <div className='flex flex-col'>
            <h1 className='font-medium capitalize'>{item.user.fullname}</h1>
            <label className='text-gray-500 text-xs'>{item.user.email}</label>
          </div>
        </div>
      )
    },
    {
      title: 'Total sales',
      key: 'totalSales',
      render: getTotalSales
    },
    {
      title: 'Total products',
      key: 'totalProducts',
      render: (item: any)=>item.products.length
    },
    {
      title: 'Address',
      key: 'address',
      render: (item: any)=>{
        const address = item.user.address
        return (
          <div>
            {
              address.pincode ?
              <div>
                {address.street}, {address.city}, {address.state}, {address.country} {address.pincode}
              </div>
              :
              "Address not found"
            }
          </div>
        )
    }
    },
    {
      title: 'Status',
      key: 'status',
      render: (item: any)=>(
        item.status === "processing" ?
        <Select style={{width: 150}} defaultValue={item.status} onChange={(status)=>changeStatus(status, item._id)}>
          <Select.Option value="processing">Processing</Select.Option>
          <Select.Option value="dispatched">Dispatched</Select.Option>
          <Select.Option value="returned">Returned</Select.Option>
        </Select>
        :
        <Tag color={item.status === "dispatched" ? "green-inverse" : "magenta-inverse"} className='capitalize'>{item.status}</Tag>
      )
    },
    {
      title: 'Created',
      key: 'created',
      render: (item: any)=>moment(item.createdAt).format('MMM DD, YYYY hh:mm  A')
    }
  ]

  const browseProducts = (item: any)=>{
    return (
      <div className='grid grid-cols-4 gap-8'>
        {
          item.products.map((p: any, pIndex: number)=>(
            <Card 
              key={pIndex}
              cover={
                <div className='w-full h-[150px] relative'>
                  <Image 
                    src={p.image}
                    fill
                    alt={p.title}
                    className='object-cover'
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              }
            >
              <Card.Meta 
                className='capitalize'
                title={p.title}
                description={
                  <div className='flex gap-2'>
                    <label>₹{priceCalculate(item.prices[pIndex], item.discounts[pIndex])}</label>
                    <del>₹{item.prices[pIndex]}</del>
                    <label>({item.discounts[pIndex]}% Off)</label>
                    <label>{item.quantities[pIndex]}PCS</label>
                  </div>
                }
              />
            </Card>
          ))
        }
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <Table 
        columns={columns}
        dataSource={data}
        rowKey="_id"
        scroll={{x:"max-context"}}
        expandable={{
          expandedRowRender: browseProducts,
          rowExpandable: (record: any) => record.name !== 'Not Expandable',
        }}
      />
    </div>
  )
}

export default Orders