import { getToken } from "next-auth/jwt"
import { redirect } from "next/dist/server/api-utils"
import { MiddlewareConfig, NextRequest,NextResponse as res } from "next/server"

export const middleware = async (req:NextRequest)=>{
   const session = await getToken({req,secret:process.env.NEXTAUTH_SECRET})

   const {pathname} = req.nextUrl
    
   if(!session && (pathname.startsWith("/user") || pathname.startsWith("/admin")))
    return res.redirect(new URL("/login", req.url))
    
   if(session)
   { 
        const role = session.role

        if(pathname.startsWith("/admin") && role !=="admin")
            return res.redirect(new URL("/login", req.url))

        if(pathname.startsWith("/user") && role !=="user")
        return res.redirect(new URL("/login", req.url))

        if((pathname === "/login" || pathname === "/signup") && role === "user")
            return res.redirect(new URL("/user/orders", req.url))

        if((pathname === "/login" || pathname === "/signup") && role === "admin")
            return res.redirect(new URL("/admin/orders", req.url))     
   }
   
   return res.next()

}

export const config :MiddlewareConfig = {
    matcher:[
        "/login",
        "/signup",
        '/user/:path*',
        "/admin/:path*",

    ]
}