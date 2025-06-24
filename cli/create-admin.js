import dotenv from "dotenv"
dotenv.config()
const log = console.log

import chalk  from "chalk"
import inquirer from "inquirer"
import bcrypt from "bcrypt"
import {MongoClient} from "mongodb"



const promptOption= [{
    type:"list",
    name:"role",
    message:"press arro up and down key to choose role ",

    choices:[
        chalk.green("User"),
        chalk.blue("Admin"),
        chalk.red("Exit"),
    ]
}]

const requiredValidation = (input,name)=>{
    if(input.length > 0)
        return true
    
    return log(chalk.red(`${name} is required`))
}

const inputOptions = [
    {
        type:"input",
        name:"fullname",
        message:'Enter your name ',
        validate: (input)=>{
            return  requiredValidation(input,"fullname")
        }
    },
    {
        type:"input",
        name:"email",
        message:'Enter  email',
        validate: (input)=>{
           return requiredValidation(input,"email")
        }
    },
    {
        type:"input",
        name:"password",
        message:'Enter password',
        validate: (input)=>{
          return  requiredValidation(input,"password")
        }
    }
]

const createRole = async (role,db)=>{
    try{ 
         const input =  await inquirer.prompt(inputOptions)
         input.role = role
         input.createdAt = new Date()
         input.updateAt = new Date()
         input._v= 0
        input.password = await bcrypt.hash(input.password,12)
        const User = db.collection("users")
        await User.insertOne(input) 
        log(chalk.green(`${role} has been  Created !`))
        process.exit()
    }
    catch(err)
    {
        log(chalk.bgRed(`signup faile ${err}`))
        process.exit()
    }
}


const exitApp = ()=>{
    log(chalk.blue(`goodBY exit the process `))
    process.exit()
}


const wellcome = async (db)=>{

    log(chalk.bgRed.white.bold("✨ Admin Signup console ✨"))
 
    const {role} = await inquirer.prompt(promptOption)
   
    if(role.includes("User"))
        return createRole("user",db)
    if(role.includes("Admin"))
        return createRole("admin",db)

    if(role.includes("Exit"))
     return exitApp()
}

const main = async (db)=>{
MongoClient.connect(process.env.DB_URL)

.then((conn)=>{
    db = conn.db(process.env.DB_NAME)
    wellcome(db)
})

.catch(()=>{
    log(chalk.redBright("Faild to connect with database"))
    process.exit()
})

   
}

main()
