import mongoose from "mongoose"
mongoose.connect("mongodb://localhost:27017/Ecommers")

import { NextRequest, NextResponse as res } from "next/server";
import path from "path";
import { v4 as uuId } from "uuid";
import fs from "fs"
import ProductModel from "../../../model/product.model";
import ServerCatchError from "../../../Lib/server-catch-error";

export const POST = async (req:NextRequest)=>{
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

export const GET = async (req:NextRequest)=>{
    try{
       const {searchParams} = new URL(req.url)
       const slug  = searchParams.get("slug")

       if(slug)
       {
        const slugs = await ProductModel.distinct("slug")
        return res.json(slugs)
       }

       const products = await ProductModel.find()
       return res.json(products)

    }
    catch(err)
    {
        return ServerCatchError(err)
    }
}