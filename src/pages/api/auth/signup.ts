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
console.log('hello')
 await connectDB();
 console.log('connection success')
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
   name: `${first_name + " " + last_name}`,
   email,
   password: cryptedPassword,
   emailVerified: { // Correctly initialize emailVerified field
       emailVerified: false,
       isNewUser: true,
       profileVisited: false,
       calendarVisited: false, // Corrected spelling
       location: false,
   },
   Biography: "This user has not provided a description.", // Default Biography
   followers: 0, // Default value
   following: 0, // Default value
   role: "user", // Default role
});
 console.log('AWAIT NEWUSER SAVE');
 await newuser.save()
 console.log('Newuser Save Successfull')
 console.log('create activation token')
 const activation_token= createActivationToken({
   id: newuser._id.toString(),
 });
 const url = `${process.env.NEXTAUTH_URL}/activate/${activation_token}`
 console.log('ACTIVATION TOKEN.')
 await sendMail(
   newuser.email, 
   newuser.name,
   "",
   url,
   "Activate your account.",
   activateTemplateEmail
 )
 res.json({message: 'Register success! Please activate your account to start! An email has been sent.'}) 

}catch(error){
    res.status(500).json({ message: (error as Error).message})

}
}