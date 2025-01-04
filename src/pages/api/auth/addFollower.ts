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
console.log(req.body)
if( !req.body ) {
 throw new Error("Error ! no req.body");
}
if ( !req.body.userId) {
    throw new Error("Error! The user liked a page without a userId");
}
if ( !req.body.session) {
    throw new Error("Error! The user sent a like without being signed in.");
}

const updatedUser = await User.findByIdAndUpdate(
  req.body.userId,
  {$push: {followers: await User.findById(req.body.session.id)}},
  { new: true, runValidators: true}
);
if (!updatedUser) {
    throw new Error("The user being followed was not found!")
}
const followingUser = await User.findByIdAndUpdate(
    req.body.session.id,
    {$push: { following : await User.findById(req.body.userId)}},
    { new: true, runValidators: true},
)
 res.json({message: 'Liked success! Please activate your account to start! An email has been sent.'}) 

}catch(error){
    res.status(500).json({ message: (error as Error).message})

}
}