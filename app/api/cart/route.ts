
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
mongoose.connect(db)

import { NextRequest, NextResponse as res } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import CartModel from "../../../model/cart.model";
import ServerCatchError from "../../../Lib/server-catch-error";


export const POST = async (req: NextRequest)=>{
    try {
        const session = await getServerSession(authOptions)
        if(!session)
            return res.json({message: 'Unauthorized'}, {status: 401})

        if(session.user.role !== "user")
            return res.json({message: 'Unauthorized'}, {status: 401})

        const body = await req.json()
        body.user = session.user.id

        const updated = await CartModel.findOneAndUpdate({user: body.user, product: body.product}, {$inc: {qnt: 1}}, {new: true})
        if(updated)
            return res.json(updated)

        const cart = await CartModel.create(body)
        return res.json(cart)
    }
    catch(err)
    {
        return ServerCatchError(err)
    }
}

export const GET = async (req: NextRequest)=>{
    try {
        const session = await getServerSession(authOptions)
        if(!session)
            return res.json({message: 'Unauthorized'}, {status: 401})

        if(session.user.role !== "user")
            return res.json({message: 'Unauthorized'}, {status: 401})

        const carts = await CartModel.find({user: session.user.id}).populate('product')
        return res.json(carts)
    }
    catch(err)
    {
        return ServerCatchError(err)
    }
}
