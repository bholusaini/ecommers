const db = (`${process.env.DB_URL}/${process.env.DB_NAME}`)
import mongoose from "mongoose"
mongoose.connect(db)

import  bcrypt  from 'bcrypt';
import { NextRequest ,NextResponse as res } from "next/server"
import UserModel from "../../../../model/user.model"
import ServerCatchError from "../../../../Lib/server-catch-error"


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
    role:user.role
   }
  
   return res.json(payload)
 }
 catch(err)
 {
   return ServerCatchError(err)
 }
}