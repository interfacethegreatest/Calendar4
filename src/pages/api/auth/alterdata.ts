// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { RESET_TOKEN_SECRET } = process.env;

interface UserToken{
    id: String
}

export default async function handler(req: NextApiRequest, res:NextApiResponse){
try{
    await connectDB();
    const { csrfToken, password } = req.body;
    const userToken = jwt.verify(csrfToken, RESET_TOKEN_SECRET!) as UserToken;
    const userDB = await User.findById(userToken.id);
    if (!userDB){
        return res
        .status(400)
        .json({message:'This account does not exist in DB.'})
    }
    await User.findByIdAndUpdate(userDB.id, { isNewUser: true})
    res.json({
    message: 'Your account has been parsed'}) 

}catch(error){
    res.status(500).json({ message: (error as Error).message})

}
}