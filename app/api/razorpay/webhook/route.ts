
import { NextRequest ,NextResponse as res } from "next/server";
import fs from "fs"
import crypto from "crypto"
import { message } from "antd";
import ServerCatchError from "../../../../Lib/server-catch-error";


export const POST = async (req:NextRequest)=>{

   try{
     const signature = req.headers.get("x-razorpay-signature")
        if(!signature)
           return res.json({message:"invalid signature"},{status:400})
    const body = await req.json()

    
   const mySignature =  crypto.createHmac("sha256",process.env.RAZORPAY_WEBHHOK_SECRET!)
    .update(JSON.stringify(body))
    .digest("hex")
    
    if(signature !== mySignature)
        return res.json({message:"invalid signature"},{status:400})

     if(body.event === "payment.authorized" && process.env.NODE_ENV == "development")
     {
        console.log("payment success")
     }

     if(body.event === "payment.captured" )
     {
        console.log("payment success")
     }

     if(body.event === "payment.failed" )
     {
        console.log("payment failed")
     }
     return  res.json({ message: "webhook received" })
   }
   catch(err)
   {
    return ServerCatchError(err)
   }

} 