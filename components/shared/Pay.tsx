'use client'
import { Button, Modal, Result } from 'antd'
import priceCalculate from '@/lib/price-calculate'
import '@ant-design/v5-patch-for-react-19';
import clientCatchError from '@/lib/client-catch-error'
import axios from 'axios'
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useSession } from 'next-auth/react'
import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ModifiedRazorpayInterface extends RazorpayOrderOptions {
  notes: any
}

interface PayInterface {
    theme?: 'happy' | 'sad'
    title?: string
    product: any
    onSuccess?: (payload: PaymentSuccessInterface)=>void
    onFailed?: (payload: PaymentFailedInterface)=>void
}

interface PaymentSuccessInterface {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
}

interface PaymentFailedInterface {
    reason: string
    order_id: string
    payment_id: string
}


const Pay: FC<PayInterface> = ({product, onSuccess, onFailed, title="Pay now", theme="happy"}) => {
  const [open, setOpen] = useState(false)
  const isArr = Array.isArray(product)
  const session = useSession()
  const { Razorpay } = useRazorpay()
  const router = useRouter()

  const getTotalAmount = ()=>{
    let sum = 0
    for(let item of product)
    {
      const amount = priceCalculate(item.product.price, item.product.discount)*item.qnt
      sum = sum+amount
    }
    return sum
  }

  const getOrderPayload = ()=>{
    const products = []
    const prices = []
    const discounts = []
    const quantities = []

    if(!isArr)
    {
      return {
        products: [product._id],
        prices: [product.price],
        discounts: [product.discount],
        quantities: [1]
      }
    }

    for(let item of product)
    {
      products.push(item.product._id)
      prices.push(item.product.price)
      discounts.push(item.product.discount)
      quantities.push(item.qnt)
    }
    return {
      products,
      prices,
      discounts,
      quantities
    }
  }

  const handleSuccess = (payload: PaymentSuccessInterface)=>{
    if(onSuccess)
        return onSuccess(payload)

    return null
  }

  const payNow = async ()=>{
    try {
      if(!session.data)
        throw new Error("Session not initalized yet")

      if(!session.data.user.address.pincode)
      {
        sessionStorage.setItem("message", "Please update your address first")
        return router.push("/user/settings")
      }

      const payload = {
        amount: isArr ? getTotalAmount() : product.price
      }
      
      const {data} = await axios.post('/api/razorpay/order', payload)
      console.log(data)

      const options: ModifiedRazorpayInterface = {
          name: "Ecom Shops",
          description: "Bulk Product",
          amount: data.amount,
          order_id: data.id,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          currency: 'INR',
          prefill: {
            name: session.data.user.name as string,
            email: session.data.user.email as string
          },
          notes: {
            name: session.data.user.name as string,
            user: session.data.user.id,
            orders: JSON.stringify(getOrderPayload())
          },
          handler: handleSuccess
      }

      const rzp = new Razorpay(options)
      rzp.open()

        rzp.on("payment.failed",(err: any)=>{
            setOpen(true)
            if(!onFailed)
                return

            const payload = {
                reason: err.reason,
                order_id: err.metadata.order_id,
                payment_id: err.metadata.payment_id
            }
            onFailed(payload)
        })
    }
    catch(err)
    {
      clientCatchError(err)
    }
  }

  return (
    <>
      {
        theme === "happy" ? 
        <Button 
          size="large" 
          type='primary' 
          onClick={payNow} 
          className='!w-full !py-6 !font-medium !text-lg !bg-green-500'
        >{title}</Button>
        :
        <Button 
          danger
          size="large" 
          type='primary' 
          onClick={payNow} 
          className='!w-full !py-6 !font-medium !text-lg'
        >{title}</Button>
      }
      <Modal open={open} footer={null} width={"50%"} onCancel={()=>setOpen(false)}>
          <Result
            status="error"
            title="Payment Failed"
            subTitle="An error occured during payment capture please try again after sometime"
            extra={[
              <Link href="/">
                <Button type="primary" key="console">
                  Go Back
                </Button>
              </Link>
            ]}
          />
      </Modal>
    </>
  )
}

export default Pay