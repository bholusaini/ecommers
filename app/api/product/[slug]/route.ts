const db = (`${process.env.DB_URL}/${process.env.DB_NAME}`)
import mongoose from "mongoose"
mongoose.connect(db)

import { NextRequest ,NextResponse as res} from "next/server";
import ServerCatchError from "../../../../Lib/server-catch-error";
import SlugInterface from "../../../../interface/Slug.interface";
import ProductModel from "../../../../model/product.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { message } from "antd";

export  const GET = async (req:NextRequest,context:SlugInterface)=>{
    try{
        const {slug} = await context.params
        const product = await ProductModel.find({slug})
      
        if(!product) 
            return res.json({message:"Product not fount "},{status:404})

        return res.json(product)
    }
    catch(err)
    {
        return ServerCatchError(err)
    }
}
export  const PUT = async (req:NextRequest,context:SlugInterface)=>{
    try{
        const session =  await getServerSession(authOptions)
       
        if(!session)
            return res.json({message:"unauthorized"},{status:401})

        if(session.user.role !== "admin")
            return res.json({message:'Unauthorized'},{status:401})
        const {slug:id} = await context.params 
        const body = await req.json()
        const product = await ProductModel.findByIdAndUpdate(id,body,{new:true})
      
        if(!product) 
            return res.json({message:"Product not fount "},{status:404})

        return res.json(product)
    }
    catch(err)
    {
        return ServerCatchError(err)
    }
}
export  const DELETE = async (req:NextRequest,context:SlugInterface)=>{
    try{
        const {slug :id} = await context.params
        const product = await ProductModel.findByIdAndDelete(id)
      
        if(!product) 
            return res.json({message:"Product not fount "},{status:404})

        return res.json(product)
    }
    catch(err)
    {
        return ServerCatchError(err)
    }
}