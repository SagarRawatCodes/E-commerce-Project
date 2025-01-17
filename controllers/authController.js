import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
export const registerController = async(req,res) =>{
try{
    const name =req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    const phone=req.body.phone;
    const address= req.body.address;
    const answer = req.body.answer;

    //validation
    if(!name){
        return res.send({message:`name is Required`})
    }
    if(!email){
        return res.send({message:`email is Required`})
    }
    if(!password){
        return res.send({message:`password is Required`})
    }
    if(!phone){
        return res.send({message:`phone number is Required`})
    }
    if(!address){
        return res.send({message:`address is Required`})
    }
    if(!answer){
        return res.send({message:`Answer is Required`})
    }

    //user checking
    const existingUser = await userModel.findOne({email})
    //existing user 
    if(existingUser){
        return res.status(200).send({
            success:false,
            message:`Already Register please login`
        })
    }
    //register user
    const hashedPassword = await hashPassword(password)
    //save
    const user =await new userModel({name,email,phone,address,password:hashedPassword,answer}).save()
    res.status(201).send({
        success:true,
        message:'user Register successfully',
        user
    })
}catch(error){
    console.log(error)
    res.status(500).send({
        success:false,
        message:"Error in Registration",
        error

    })

}
};
  
//POST LOGIN
export const loginController =async(req,res) =>{
    try{
        const {email,password} =req.body
        //validation
        if(!email || !password){
            return res.status(404.).send({
                success:false,
                message:"Invalid email or password"
            })
        }
        //check user
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(404).send({
            success:false,
            message:"Email is  not registered"
        })
    }
    const match = await comparePassword(password,user.password.toString())
    if(!match){
        return res.status(200).send({
            success:false,
            messsage:"Invalid password"
        })
    }
    //Token
    const token = await jwt.sign({_id:user._id},process.env.JWT_SECRET);
    res.status(200).send({
        success:true,
        message:"login successfully",
        user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role,

        }
        ,token,
    });

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        })

    }

};

//forgotPasswordController

export const forgotPasswordController= async(req,res) =>{
    try{
        const {email,answer,newPassword} = req.body
        if(!email){
            res.status(400).send({message:'Email is Required'})
        }
        if(!answer){
            res.status(400).send({message:'answer is Required'})
        }
        if(!newPassword){
            res.status(400).send({message:'New Password is Required'})
        }

  //check 
  const user = await  userModel.findOne({email,answer})
  //validation
  if(!user){
    return res.status(404).send({
        success:false,
        message:'Wrong Email Or Answer'
    })
  }

  const hashed = await hashPassword(newPassword)
  await userModel.findByIdAndUpdate(user._id,{password:hashed})
  res.status(200).send({
    sucess:"true",
    message:"Password Reset Successfully",
  })


    }catch(error){
        console.log(error);
        res.status(500).semd({
            success:false,
            message:'something went wrong',
            error
        })
    }

};
//test controller
export const testController=(req,res) =>{
    res.send('protected Route');
};