import { getToken } from "next-auth/jwt";
import { NextRequest ,NextResponse as res} from "next/server";


export const middleware = async (req:NextRequest)=>{

    const session = await getToken({req,secret:process.env.NEXTAUTH_SECRET})
   
   
    const patname = req.nextUrl.pathname

    if(patname.startsWith('/login') && session)
        return res.redirect(new URL("/user/orders",req.url))

    if(patname.startsWith('/signup') && session)
        return res.redirect(new URL("/user/orders",req.url))

    if(patname.startsWith('/user') && !session)
        return res.redirect(new URL("/login",req.url))

    if(patname.startsWith('/admin') && !session)
        return res.redirect(new URL("/login",req.url))

     return res.next()
}