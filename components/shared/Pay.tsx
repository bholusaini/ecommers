'use client'
import fetecher from '@/Lib/fetecher'
import { Button, Empty,Skeleton } from 'antd'
import React, { FC, useState } from 'react'
import useSWR, { mutate } from 'swr'
import Errors from '../shared/Error'
import priceCalculate from '@/Lib/price-calculate'

import ClientCatchError from '@/Lib/client-catch-error'
import axios from 'axios'
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useSession } from 'next-auth/react'


interface ModifiesRazorpayInterface extends RazorpayOrderOptions {
  notes:any
}

interface PayInterface{
  product:any
  onSuccess?:(payload:PaymentSuccessInterface)=>void
  onFaild?:(payload:PaymentFaildInterface)=>void
}

interface PaymentSuccessInterface {
  razorpay_order_id :string
razorpay_payment_id :string
razorpay_signature:string

}

interface PaymentFaildInterface {
  reason:string
  order_id:string
  payment_id:string

}

const Pay :FC<PayInterface> = ({product,onSuccess,onFaild}) => {
 
console.log(product);
  const [loading,setLoading] = useState({state:false,index:0,ButtonIndex:0})
  
  const { Razorpay } = useRazorpay();
  const session = useSession() 
  const isArr = Array.isArray(product)

 console.log(isArr);

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

    for(let item of product){
        const amount = priceCalculate(item.product.price,item.product.discount)*item.qnt
       sum = sum+amount
    
       
    }
    return sum
  }   

  const getOrderPayload = ()=>{
    const products = []
    const prices = []
    const discounts = []

      if(!isArr)
    {
      return {
        products: [product._id],
        prices: [product.price],
        discounts: [product.discount],
        quantities: [1]
      }
    }

    for(let item of product){
      products.push(item.product._id)
      prices.push(item.product.price)
      discounts.push(item.product.discount)
    }

    return (
      {
        products,
        prices,
        discounts
      }
    )
  }


  const handleOnSuccess = (payload:PaymentSuccessInterface)=>{

    if(onSuccess)
        return onSuccess(payload)

    return null
  }

  const  payNow =   async ()=>{
     try{
      if(!session.data)
        throw new Error("session not inislized yet")       

      const payload = {
        amount: isArr ? getTotalAmount() : product.price
      }

      const {data} =  await axios.post("/api/razorpay/order", payload)
      console.log(data)

      const options:ModifiesRazorpayInterface = {
        name:"Ecom shop ",
        description:"bulk sfs",
        amount:data.amount,
        order_id:data.id,
        key:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        currency:'INR',
        prefill:{
          name:session.data.user.name as string,
          email:session.data.user.email as string
        },
        notes:{
          name:session.data.user.name as string,
          user:session.data.user.id,
          orders:JSON.stringify(getOrderPayload())
        },

        handler:handleOnSuccess
      }

      const rzp = new Razorpay(options)
      rzp.open()
     

      rzp.on("payment.failed",(err:any)=>{
        if(!onFaild)
          return
        

        const payload :PaymentFaildInterface ={
          reason:err.reason,
          order_id:err.metadata.order_id,
          payment_id:err.medata.payment_id
        }
          onFaild(payload)

      
    
      })
     }
     catch(err)
     {
       ClientCatchError(err)
     }
  }



  if(product.length === 0)
    return <Empty/>
    
  return (
      <Button size='large' type='primary' onClick={payNow }>Pay now</Button>
  )
}
export default Pay