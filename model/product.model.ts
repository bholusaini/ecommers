import { Schema,models,model} from "mongoose";
const productSchema = new Schema({
   title:{
     type:String,
    required:true,
    trim:true
   },
   price:{
      type:Number,
      required:true
   },
   discount:{
      type:Number,
      required:true
   },
   quantity:{
      type:Number,
      required:true
   },
   description:{
      type:String,
      required:true
   },
   image:{
      type:String,
      required:true
   },
   slug:{
    type:String,
    trim:true
   }

},{timestamps:true})

productSchema.pre("save", function(next){
   this.slug = this.title.toLowerCase().split(" ").join("-")
   next()
})

const ProductModel = models.Product || model("Product",productSchema)

export default ProductModel

