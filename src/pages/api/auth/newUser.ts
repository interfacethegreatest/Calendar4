// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import UserNaviation from "@/models/UserNavigation";
import connectDB from "@/utils/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res:NextApiResponse){
try{  
await connectDB();
const userNavigation = new UserNaviation({
 //
});
await userNavigation.save()
// find out where the user wants to go and send the url in return
res.json({message: 'Register success! Please activate your account to start!'}) 
    
}catch(error){
 res.status(500).json({ message: (error as Error).message})
 
}
}