import mongoose from "mongoose"
mongoose.connect("mongodb://localhost:27017/Ecommers")

import { NextRequest, NextResponse as res } from "next/server";
import path from "path";
import { v4 as uuId } from "uuid";
import fs from "fs"
import Prodect from "../../../components/admin/products/Prodect";
import ProductModel from "../../../model/product.model";

export const POST = async (req:NextRequest)=>{
    //  for file uploads
    const body = await req.formData()
    const file = body.get("file") as File ||null

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
        title:body.get("title"),
        slug:body.get("slug"),
        image:`/products/${fileName}`
    }

  const products=  await ProductModel.create(payload)
    return res.json(products)

}