import { NextRequest, NextResponse as res } from "next/server";
import serverCatchError from "@/lib/server-catch-error";
import crypto from 'crypto'
import OrderModel from "@/models/order.model";
import PaymentModel from "@/models/payment.model";
import fs from 'fs'
import moment from "moment";
import path from 'path'
import CartModel from "@/models/cart.model";
const root = process.cwd()

interface CreateOrderInterface {
    user: string
    products: string[]
    discounts: string[]
    prices: string[]
    grossTota:number
}

interface CreatePaymentInterface {
    user: string
    paymentId: string
    orderId: string
    vendor?: 'razorpay' | 'stripe'
    tax:number,
    fee:number
    method:string
    currency:string
    status:string
    amount:number
}

interface DeleteCartsInterface {
    user: string
    products: string[]
}

const createLog = (err: unknown, service: string)=>{
    if(err instanceof Error)
    {
        const dateTime = moment().format('DD-MM-YYYY_hh-mm-ss_A');
        const filePath = path.join(root, 'logs', `order-error-${dateTime}.txt`);
        fs.writeFileSync(filePath, err.message)
        return false
    }
}

const createOrder = async (order: CreateOrderInterface)=>{
    try {
        const {orderId} = await OrderModel.create(order)
        return orderId
    }
    catch(err)
    {    
        
        return createLog(err, "order")
    }
}

const deleteCarts = async (carts: DeleteCartsInterface)=>{
    try {
        const query = carts.products.map((id)=>({user: carts.user, product: id}))
        await CartModel.deleteMany({$or: query})
        return true
    }
    catch(err)
    {
        return createLog(err, "delete-cart")
    }
}

const createPayment = async (payment: CreatePaymentInterface)=>{
    try {
        await PaymentModel.create(payment)
        return true
    }
    catch(err)
    {
        return createLog(err, "payment")
    }
}

export const POST = async (req: NextRequest)=>{
    try {
        const signature = req.headers.get('x-razorpay-signature')
        if(!signature)
            return res.json({message: 'Invalid signature'}, {status: 400})

        const body = await req.json()
        const user = body.payload.payment.entity.notes.user
        const paymentId = body.payload.payment.entity.id
        const {tax,fee,status,method,currency } = body.payload.payment.entity
        const grossTotal = (body.payload.payment.entity.amount/100)
        const orders = JSON.parse(body.payload.payment.entity.notes.orders)

        const mySignature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHHOK_SECRET!)
        .update(JSON.stringify(body))
        .digest('hex')

        if(signature !== mySignature)
            return res.json({message: 'Invalid signature'}, {status: 400})


       if(body.event === "payment.authorized" && process.env.NODE_ENV === "development")
       {
            const orderId = await createOrder({user, ...orders,grossTotal})

            if(!orderId)
                return res.json({message: 'Failed to create order'}, {status: 424})

            const payment = await createPayment({
                user, 
                orderId, 
                paymentId,
                tax,
                fee,
                currency,
                amount:grossTotal,
                method,
                status   
            })
            
            if(!payment)
                return res.json({message: 'Failed to create payment'}, {status: 424})

            await deleteCarts({user, products: orders.products})

            return res.json({success: true})
       }

       if(body.event === "payment.captured")
       {
            const orderId = await createOrder({user, ...orders,grossTotal})

            if(!orderId)
                return res.json({message: 'Failed to create order'}, {status: 424})

            const payment = await createPayment({
                user, 
                orderId, 
                paymentId,
                tax,
                fee,
                currency,
                amount:grossTotal,
                method,
                status  
            })
            
            if(!payment)
                return res.json({message: 'Failed to create payment'}, {status: 424})

            return res.json({success: true})
       }

       if(body.event === "payment.failed")
       {
        console.log("payment failed")
       }

       return res.json({success: true})
    }
    catch(err)
    {
        console.log(err)
        return serverCatchError(err)
    }
}