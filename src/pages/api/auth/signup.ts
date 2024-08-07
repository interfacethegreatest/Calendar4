// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";
import bcrypt from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await connectDB();
  const { first_name, last_name, email, password} = req.body;
  if (!first_name || !last_name || !email || !password){
    return res.status(400).json({message:"Please fill in all fields."});
  }
  if(!validator.isEmail(email)){
    return res.status(400).json({message:"Please add a valid email address."});
  }
  const user = await User.findOne({
    email:email,
  });
  if(user){
    return res.status(400).json({message:"This email address already exists."})
  }
  if( password.length < 7 ){
    return res.status(400).json({message:"Password must be atleast 7 characters."})
  }
  const cryptedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    name: `${first_name}+" "+${last_name}`,
    email,
    password: cryptedPassword,
  });
  await newUser.save();
  res.json({message: 'Register success! Please activate your account to start.'})
  } catch (error) {
    res.status(500).json({message:(error as Error).message})
    
  }
  
}
