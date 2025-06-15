import { NextRequest ,NextResponse as res} from "next/server";
import ServerCatchError from "../../../../Lib/server-catch-error";
import SlugInterface from "../../../../interface/Slug.interface";
import ProductModel from "../../../../model/product.model";

export  const GET = async (req:NextRequest,context:SlugInterface)=>{
    try{
        const {slug} = await context.params
        const product = await ProductModel.find({slug})
      
        if(!product) 
            return res.json({message:"Product not fount "},{status:404})

        return res.json(product)
    }
    catch(err)
    {
        return ServerCatchError(err)
    }
}