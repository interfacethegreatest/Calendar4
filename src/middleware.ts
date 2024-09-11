import { Session } from "inspector";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "./utils/connectDB";
import UserModal from '@/models/User';
import User from "@/models/User";

export async function middleware(req:NextRequest){
    const {pathname, origin} = req.nextUrl
    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === "production",

    });
    if(pathname==="/auth"){
        if (session){
            return NextResponse.redirect(`${origin}`);
        }
    }
    if(pathname.startsWith('/admin')){
        if (!session) return NextResponse.redirect(`${origin}`);
        if (session.role =="admin") return NextResponse.redirect(`${origin}`);
    }
}