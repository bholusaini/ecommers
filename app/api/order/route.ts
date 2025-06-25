const db = `${process.env.DB_URL}/${process.env.DB_NAME}`

import mongoose from "mongoose";
import { getServerSession } from "next-auth";
mongoose.connect(db)

import { NextRequest, NextResponse as res } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route";
import OrderModel from "@/model/order.model";
import ServerCatchError from "@/Lib/server-catch-error";

export const POST = async (req: NextRequest)=>{
    try {
        const session = await getServerSession(authOptions)
        if(!session)
            return res.json({message: 'Unauthorized'}, {status: 401})

        if(session.user.role !== "user")
            return res.json({message: 'Unauthorized'}, {status: 401})

        
        const body = await req.json()
        body.user = session.user.id
        const order = await OrderModel.create(body)
        return res.json(order)
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

        let orders = []
        const role = session.user.role
        const id = session.user.id

        if(role === "user")
            orders = await OrderModel.find({user: id}).sort({createdAt: -1}).populate("product")

        if(role === "admin")
            orders = await OrderModel.find().sort({createdAt: -1})
            .populate("user", "fullname email mobile")
            .populate("product")

        return res.json(orders)
    }
    catch(err)
    {
        return ServerCatchError(err)
    }
}