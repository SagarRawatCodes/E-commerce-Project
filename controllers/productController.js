import slugify from "slugify"
import productModel from "../models/productModel.js"
import fs from 'fs'

export const createProductController =async(req,res)=>{

    try{
        const {name,slug,description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files

        //validation
        switch(true){
            case !name:
                return res.status(500).send({
                    error:"name is required"
                })
                case !description:
                    return res.status(500).send({
                        error:"description is required"
                    })
                    case !price:
                        return res.status(500).send({
                            error:"price is required"
                        })
                        case !category:
                            return res.status(500).send({
                                error:"category is required"
                            })
                            case !quantity:
                                 return res.status(500).send({
                                 error:"quantity is required"
                                })
                                case photo && photo.size>100000:
                                 return res.status(500).send({
                                 error:"Photo is required and should be less than 1 mb"
                                })
                        }
        const products = new productModel({...req.fields,slug:slugify(name)})
      if(photo){
        products.photo.data = fs.readFileSync(photo.path)
        products.photo.contentType = photo.type;
      }
      await products.save()
      res.status(201).send({
        success:true,
        message:"Product created successfully",
        products
      })

    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in creating product"
        })
    }

};

//get all products

export const getProductController= async(req,res)=>{
    try{
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            counTotal:products.length,
            message:"All Products",
            products,
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in getting products'
        })
    }

}

// get single product

export const getSingleProductController=async(req,res)=>{
    try{
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category");
        res.status(200).send({
            success:true,
            message:'Single Product fetched',
            product,
        })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting single product',
            error
        })
    }


}

export const productPhotoController=async(req,res)=>{
    try{
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type', product.photo.ContentType)
            return res.status(200).send(
                product.photo.data
                
            )
        }
    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error while getting photo',
            error
        })
    }

}

//delete controller

export const deleteProductController= async(req,res) =>{
    try{
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success:true,
            message:"Product Deleted Successfully"

        })
  }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while deleting product',
        })
    }

}

//update Product
export const UpdateProductController=async(req,res)=>{

        try{
            const {name,slug,description,price,category,quantity,shipping} = req.fields
            const {photo} = req.files
    
            //validation
            switch(true){
                case !name:
                    return res.status(500).send({
                        error:"name is required"
                    })
                    case !description:
                        return res.status(500).send({
                            error:"description is required"
                        })
                        case !price:
                            return res.status(500).send({
                                error:"price is required"
                            })
                            case !category:
                                return res.status(500).send({
                                    error:"category is required"
                                })
                                case !quantity:
                                     return res.status(500).send({
                                     error:"quantity is required"
                                    })
                                    case photo && photo.size>100000:
                                     return res.status(500).send({
                                     error:"Photo is required and should be less than 1 mb"
                                    })
                            }
            const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields,slug:slugify(name)}, {new:true})
          if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type;
          }
          await products.save()
          res.status(201).send({
            success:true,
            message:"Product updated successfully",
            products
          })
    
        }
        catch(error){
            console.log(error)
            res.status(500).send({
                success:false,
                error,
                message:"Error in updating product"
            })
        }
    
    };
    

