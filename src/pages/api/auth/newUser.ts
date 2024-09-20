// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from "@/utils/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res:NextApiResponse){

console.log(req.body);
try {
    //console.log("go to profile? : "+req.body.goToProfile);
if (req.body.goToCalender){
    // to be designed
    res.json({message:'Home'}); 
};
if (req.body.goToUserCalender) {
    // to be designed
    res.json({message:'User'}) ;
}
if ( req.body.goToCalender != null ){
    res.json({message:'userProfile'}); 
}
} catch (error) {
    res.status(500).json({ message: (error as Error).message})
}


// find out where the user wants to go and send the url in return
//res.json({message: 'Register success! Please activate your account to start!'}) 
}    