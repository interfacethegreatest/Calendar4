import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req:NextRequest){
    const {pathname, origin} = req.nextUrl
    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: process.env.NODE_ENV === "production",

    });
    if(pathname==="/auth"){
        if (session && session.verified?.isNewUser){
            return NextResponse.redirect(`${origin}/new`);
        }
        if(session) {
            return NextResponse.redirect(`${origin}/new`);
        }
    }
    if(pathname.startsWith('/admin')){
        if (!session) return NextResponse.redirect(`${origin}`);
        if (session.role =="admin") return NextResponse.redirect(`${origin}`);
    }
}