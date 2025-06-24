const db = (`${process.env.DB_URL}/${process.env.DB_NAME}`)
import mongoose from "mongoose"
mongoose.connect(db)

import { NextRequest, NextResponse as res } from "next/server";
import path from "path";
import { v4 as uuId } from "uuid";
import fs from "fs"

import { message } from "antd";
import ProductModel from "../../../../model/product.model";
import ServerCatchError from "../../../../Lib/server-catch-error";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const PUT = async (req:NextRequest)=>{
    try{

        const session = await getServerSession(authOptions)
                if(!session)
                    return res.json("Unauthorized",{status:401})
                if(session.user.role !== "admin")
                    return res.json({message:"Unauthorized"},{status:401})
        
        //  for file uploads
        const body = await req.formData()
        const id = body.get("id")
        const file = body.get("image") as File ||null

        if(!file)
            return res.json({message:"product file not sent"},{status:400})

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const root = process.cwd()
        const folder = path.join(root,"public","products")
        const fileName = `${uuId()}.png`
        const filePath = path.join(folder,fileName)

        fs.writeFileSync(filePath,buffer)

        const payload = {
            image: `/products/${fileName}`
        }
        const products=  await ProductModel.updateOne({_id:id},{$set:payload})
        return res.json(products)
    }
        catch(err)
    {
        return ServerCatchError(err)
    }
}

