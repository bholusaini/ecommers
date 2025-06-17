import mongoose from "mongoose"
mongoose.connect("mongodb://localhost:27017/Ecommers")

import { NextRequest, NextResponse as res } from "next/server";
import path from "path";
import { v4 as uuId } from "uuid";
import fs from "fs"
import ProductModel from "../../../model/product.model";
import ServerCatchError from "../../../Lib/server-catch-error";
import { message } from "antd";

export const POST = async (req:NextRequest)=>{
    try{

        //  for file uploads
        const body = await req.formData()
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
      title: body.get("title"),
      price: body.get("price"),
      discount: body.get("discount"),
      quantity: body.get("quantity"),
      description: body.get("description"),
      image: `/products/${fileName}`
    }
    
      const products=  await ProductModel.create(payload)
        return res.json(products)
    }
       catch(err)
    {
        return ServerCatchError(err)
    }
}

export const GET = async (req:NextRequest)=>{
    try{
       const {searchParams} = new URL(req.url)
       const slug  = searchParams.get("slug")
       const page = Number(searchParams.get("page")) || 1
       const limit = Number(searchParams.get("limit")) || 16
       const skip = (page-1)*limit
       const search = searchParams.get("search")

       if(slug)
       {
        const slugs = await ProductModel.distinct("slug")
        return res.json(slugs)
       }
       const total = await ProductModel.countDocuments()
       
       if(search)
       {
        const products = await ProductModel.find({title:RegExp(search,"i")}).sort({createdAt:-1}).skip(skip).limit(limit)
        return res.json({total,data:products})
       }
       
       const products = await ProductModel.find().sort({createdAt:-1}).skip(skip).limit(limit).lean()
       return res.json({total,data:products})

    }
    catch(err)
    {
        return ServerCatchError(err)
    }
}
