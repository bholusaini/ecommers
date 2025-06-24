import axios from "axios";

import NextAuth, { NextAuthOptions, Session,User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

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
                token.role = user.role 
            }
            return token
        },

        async session({session,token}){
          
            if(token){
              session.user.id = token.id as string
              session.user.role = token.role as string
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export {handler as GET ,handler as POST}