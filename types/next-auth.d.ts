import NextAuth from "next-auth";

declare module "next-auth"{
    interface Session{
        user:{
            id:string,
            name?:stirng |null
            email?:stirng |null
            image?:stirng |null
            role?:stirng |null
        }
    }

    interface User {
        id:string
        role?:string
    }
}