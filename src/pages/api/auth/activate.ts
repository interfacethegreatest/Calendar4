// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken"
const { ACTIVATION_TOKEN_SECRET } = process.env;

interface UserToken{
    id: String
}

export default async function handler(req: NextApiRequest, res:NextApiResponse){
try{
    await connectDB();
    const { token } = req.body;
    const userToken = jwt.verify(token, ACTIVATION_TOKEN_SECRET!) as UserToken;
    const userDB = await User.findById(userToken.id);
    console.log(userToken.id)
    console.log(userDB);
    if(userDB.emailVerified == true){
        return res
        .status(400)
        .json({message:'Email address already verified!'})
    }
    await User.findByIdAndUpdate(
        userDB.id, 
        { $set: { 'verified.emailVerified': true } }, 
        { new: true }  // Returns the updated document
    );
    res.json({
    message: 'Your account has been successfully verified!'}) 

}catch(error){
    res.status(500).json({ message: (error as Error).message})

}
}