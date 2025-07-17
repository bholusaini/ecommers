const db = `${process.env.DB_URL}/${process.env.DB_NAME}`
import IdInterface from "@/interface/id.interface";
import serverCatchError from "@/lib/server-catch-error";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse as res } from "next/server";
import UserModel from "@/models/user.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import '@ant-design/v5-patch-for-react-19';
mongoose.connect(db)

export const PUT = async (req: NextRequest, context: IdInterface)=>{
    try {
        const session = await getServerSession(authOptions)

        if(!session)
            return res.json({message: 'Unauthorized'}, {status: 401})

        if(session.user.role !== "admin")
            return res.json({message: 'Unauthorized'}, {status: 401})

        const userId = context.params.id
        const body = await req.json()

        await UserModel.updateOne({_id: userId}, {role: body.role})
        return res.json({message: 'Role changed !'})
    }
    catch(err)
    {
        return serverCatchError(err)
    }
}