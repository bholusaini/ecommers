'use client'
import fetecher from '@/Lib/fetecher'
import { Button, Card, Empty, Image, Skeleton, Space } from 'antd'
import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Errors from '../shared/Error'
import priceCalculate from '@/Lib/price-calculate'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import ClientCatchError from '@/Lib/client-catch-error'
import axios from 'axios'

const Carts = () => {
  const [loading,setLoading] = useState({state:false,index:0,ButtonIndex:0})

 const {data,error,isLoading} = useSWR("/api/cart",fetecher)


 if(isLoading)
  return <Skeleton active/>

 if(error)
  return <Errors/>
 

  const updateQnt = async (num:number,id:string,index:number,ButtonIndex:number)=>{
  try{
      setLoading({state:true,index,ButtonIndex})
      await axios.put(`/api/cart/${id}`,{qnt:num})
      mutate("/api/cart")
  }
  catch(err)
  {
    ClientCatchError(err)
  }
  finally{
    setLoading({state:false,index:0 , ButtonIndex:0})
  }
  }
  const removeCart = async (id:string,index:number,ButtonIndex:number)=>{
  try{
      setLoading({state:true,index,ButtonIndex})
      await axios.delete(`/api/cart/${id}`)
      mutate("/api/cart")
  }
  catch(err)
  {
    ClientCatchError(err)
  }
  finally{
    setLoading({state:false,index:0 , ButtonIndex:0})
  }
  }
 
  const getTotalAmount = ()=>{
    let sum = 0

    for(let item of data){
        const amount = priceCalculate(item.product.price,item.product.discount)*item.qnt
       sum = sum+amount
    
       
    }
    return sum
  }   

  const  payNow =   async ()=>{
     try{
      
      const payload = {
        amount:getTotalAmount()
      }

      const {data} =  await axios.post("/api/razorpay/order", payload)
      console.log(data)
     }
     catch(err)
     {
       ClientCatchError(err)
     }
  }



  if(data.length === 0)
    return <Empty/>
    
  return (
    <div className='flex flex-col gap-8'>
      {
        data.map((item:any,index:number)=>(
          <Card key={index} className='bg-red-500' hoverable>
            <div className='flex justify-between item-center'>

               <div className='flex gap-4'>
                  <Image 
                    src={item.product.image}
                    width={150}
                    height={90}
                    alt={item.product.title}
                  />
                  <div>
                    <h1 className='text-lg font-medium capitalize'>{item.product.title}</h1>
                    <div className='flex items-center gap-3'>
                      <label className='font-medium text-base'>₹{priceCalculate(item.product.price,item.product.discount)}</label>
                      <del>₹{item.product.price}</del>
                      <label>({item.product.discount}%Off)</label>
                    </div>
                  </div>
               </div>

               <div className='flex gap-4'>
                <Space.Compact block>
                <Button 
                  loading={loading.state && loading.index === index && loading.ButtonIndex === 0}
                   icon={<PlusOutlined/>} 
                   size='large' 
                   onClick={()=>updateQnt(item.qnt+1,item._id,index,0)}
                   />
                <Button size='large'>{item.qnt}</Button>

                <Button 
                  loading={loading.state && loading.index === index && loading.ButtonIndex ===1} 
                  icon={<MinusOutlined/>} 
                  size='large' 
                  onClick={()=>updateQnt(item.qnt-1, item._id,index,1)}
                />
                <Button 
                  type='primary'
                  loading={loading.state && loading.index === index && loading.ButtonIndex ===1} 
                  icon={<DeleteOutlined/>} 
                  size='large' 
                  onClick={()=>removeCart(item._id,index,2)}
                />
                </Space.Compact>
               </div>
            </div>
          </Card>
        ))
      }

      <div className='flex justify-end items-center gap-6'>
        <h1 className='text-2xl font-semibold'>Total payable amount - ₹{getTotalAmount().toLocaleString()}</h1>
        <Button size='large' type='primary' onClick={payNow }>Pay now</Button>
      </div>
        
     
    </div>
  )
}



export default Carts