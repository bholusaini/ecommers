
import { NextRequest ,NextResponse,NextResponse as res } from "next/server"
import UserMOdel from "../../../../model/user.model"
import ServerCatchError from "../../../../Lib/server-catch-error"

import mongoose from "mongoose"
mongoose.connect("mongodb://localhost:27017/Ecommers")
export const POST = async (req:NextRequest)=>{
 try{
       const body = await req.json()
    await UserMOdel.create(body)
   return  res.json({message:"SignUp success"})
 }
 catch(err)
 {
    ServerCatchError(err)
 }
}