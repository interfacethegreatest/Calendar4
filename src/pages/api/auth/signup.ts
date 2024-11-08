// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from "bcryptjs";
import { createActivationToken } from "@/utils/tokens";
import sendMail from "@/utils/sendMail";
import { activateTemplateEmail } from "@/emailTemplates/activate";



export default async function handler(req: NextApiRequest, res:NextApiResponse){
try{

    await connectDB();
 const {first_name, last_name, email, password} = req.body;

 if(!first_name || !last_name || !email || !password) {
    return res.status(400).json({message:"Please fill in all fields."})
 }
 if(!validator.isEmail(email)){
    return res.status(400).json({message:"Please add a valid email address."})
 }


 const user = await User.findOne({
    email:email,
 });

 if (user) {
    return res.status(400).json({ message: "This email address already exists."})
 }

 if(password.length<6){
    return res.status(400).json({ message: "Password must be atleast 6 chatacters."})
 }

 const cryptedPassword = await bcrypt.hash(password, 12);
 const newuser = new User({
    name :`${first_name + " " +last_name}`,
    email,
    password : cryptedPassword,
    emailVerfied : {
      emailVerified: {
         type: Boolean,
         default: false,
     },
     isNewUser: {
         type: Boolean,
         default: true,
     },
     profileVisited: {
         type: Boolean,
         default: false,
     },
     calenderVisited: {
         type: Boolean,
         default: false,
     },
     location: {
         type: Boolean,
         default: false,
     },
    }
 });
 await newuser.save()
 const activation_token= createActivationToken({
   id: newuser._id.toString(),
 });
 const url = `${process.env.NEXTAUTH_URL}/activate/${activation_token}`
 await sendMail(
   newuser.email, 
   newuser.name,
   "",
   url,
   "Activate your account.",
   activateTemplateEmail
 )
 res.json({message: 'Register success! Please activate your account to start!'}) 

}catch(error){
    res.status(500).json({ message: (error as Error).message})

}
}