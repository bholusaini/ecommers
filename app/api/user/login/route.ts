
import  bcrypt  from 'bcrypt';
import { NextRequest ,NextResponse as res } from "next/server"
import UserModel from "../../../../model/user.model"
import ServerCatchError from "../../../../Lib/server-catch-error"

import mongoose from "mongoose"
mongoose.connect("mongodb://localhost:27017/Ecommers")

export const POST = async (req:NextRequest)=>{
 try{
    const {email,password} = await req.json()
    const user = await UserModel.findOne({email})

    if(!user)
      return res.json({messge:"user note found "},{status:404})    
      
    const isLogin = bcrypt.compareSync(password,user.password)

   if(!isLogin)
    return res.json({message:"invalid Credentials"},{status:401})    

   const payload = {
    id:user._id,
    name:user.fullname,
    email:user.email,
   }
  
   return res.json(payload)
 }
 catch(err)
 {
   return ServerCatchError(err)
 }
}