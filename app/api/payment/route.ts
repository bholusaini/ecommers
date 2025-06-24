const db = `${process.env.DB_URL}/${process.env.DB_NAME}`

import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import PaymentModel from "../../../model/payment.model";
import ServerCatchError from "../../../Lib/server-catch-error";
mongoose.connect(db)

export const POST = async (req: NextRequest)=>{
    try {
        const body = await req.json()
        const payment = await PaymentModel.create(body)
        return res.json(payment)
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

        if(session.user.role !== "admin")
            return res.json({message: 'Unauthorized'}, {status: 401})

        const payments = await PaymentModel.find().sort({createdAt: -1})
        .populate("user", "fullname email")
        .populate({
            path: "order",
            populate: {
                path: "product",
                model: "Product"
            }
        })
        return res.json(payments)
    }
    catch(err)
    {
        return ServerCatchError(err)
    }
}