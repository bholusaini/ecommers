import { Schema,models,model} from "mongoose";
const productSchema = new Schema({
   title:{
     type:String,
    required:true,
    lowarecase:true,
    trim:true
   },
   image:{
      type:String,
      required:true
   },
   slug:{
    type:String,
    required:true,
    lowarecase:true,
    trim:true
   }

},{timestamps:true})

productSchema.pre("save", function(next){
   this.slug = this.title.toLowerCase().split(" ").join("-")
   next()
})

const ProductModel = models.Product ||model("Poduct",productSchema)

export default ProductModel

