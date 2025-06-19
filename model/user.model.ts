
import { Schema,model,models } from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new Schema({
  fullname:{
    type:String,
    required:true,
    lowarecase:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    lowarecase:true,
    trim:true
  }, 
  password:{
    type:String,
    required:true,
    lowarecase:true,
    trim:true
  },
},{timestamps:true})

userSchema.pre("save", async function(next){
  this.password = await bcrypt.hash(this.password ,12)
  next()
})

const UserModel = models.User || model("User",userSchema)

export default UserModel