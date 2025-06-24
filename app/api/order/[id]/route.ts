const db = `${process.env.DB_URL}/${process.env.DB_NAME}`

import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import IdInterface from "../../../../interface/id.interface";
import OrderModel from "../../../../model/order.model";
import ServerCatchError from "../../../../Lib/server-catch-error";
mongoose.connect(db)

export const PUT = async (req: NextRequest, context: IdInterface)=>{
    try {
        const session = await getServerSession(authOptions)
        if(!session)
            return res.json({message: 'Unauthorized'}, {status: 401})

        if(session.user.role !== "admin")
            return res.json({message: 'Unauthorized'}, {status: 401})

        const {id} = context.params
        const body = await req.json()
        const order = await OrderModel.findByIdAndUpdate(id, {status: body.status}, {new: true})

        if(!order)
            return res.json({message: 'Order not found'}, {status: 404})

        return res.json(order)
    }
    catch(err)
    {
        return ServerCatchError(err)
    }
}