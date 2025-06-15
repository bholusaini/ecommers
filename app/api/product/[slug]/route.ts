import mongoose from "mongoose"
mongoose.connect("mongodb://localhost:27017/Ecommers")

import { NextRequest ,NextResponse as res} from "next/server";
import ServerCatchError from "../../../../Lib/server-catch-error";
import SlugInterface from "../../../../interface/Slug.interface";
import ProductModel from "../../../../model/product.model";

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