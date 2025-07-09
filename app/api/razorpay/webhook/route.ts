
import { NextRequest ,NextResponse as res } from "next/server";
import fs from "fs"
import { message } from "antd";

export const POST = async (req:NextRequest)=>{
    const body = await req.text()
    fs.writeFileSync("test.json",JSON.stringify(body,null,2))
    console.log("Request resived")
    return res.json({message:"success jghghf"})
} 