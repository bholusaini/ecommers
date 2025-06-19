import axios from "axios";

import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { signIn } from "next-auth/react";

interface CustomeSessionInterface extends Session{
    user:{
        id:string,
        email:string
        name:string
    }
}
export  const authOptions:NextAuthOptions = {
     

    providers:[
        CredentialsProvider({
            name: 'Credentials',

            credentials:{
                email:{
                    label:"Email",
                    name:"email"
                },
                password:{
                    label:"Password",
                    name:"password"
                }
            },        
          
            async authorize(credentials){
               try{
                const payload = {
                    email:credentials?.email,
                    password:credentials?.password
                }
               
               const {data} =  await axios.post(`${process.env.SERVER}/api/user/login`,payload)
              console.log(data);
               return data
            }
               catch(err)
               {
                 return null
               }
            }
        })
    ],
    pages:{
        signIn:"/login"
    },
    session:{
        strategy:"jwt"
    },
     
    callbacks:{
        async jwt({token,user}){
     
            if(user)
            {
                token.id = user.id 
            }
            return token
        },

        async session({session,token}){
            const customeSession = session as CustomeSessionInterface
            if(token){
                customeSession.user.id = token.id as string
            }
            return customeSession
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export {handler as GET ,handler as POST}