import NextAuth, { Account, Profile, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { JWT } from 'next-auth/jwt';
import { Adapter } from 'next-auth/adapters';

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string
  }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session : {
    strategy: "jwt",
  },
  pages: {
    signIn: '/auth'
  },
  callbacks : {
    async jwt({token, user, account, profile, isNewUser}:{
      token: JWT;
      user?: User | Adapter | undefined;
      account?: Account | null | undefined;
      profile?: Profile | undefined;
      isNewUser?: boolean | undefined;
    }) {
      if(user){
        token.provider = account?.provider;
      }
      console.log(token)
      return token
    },
    async session({ session, token }:{session:any, token:any }){
      if(session.user){
        session.user.provider = token.provider;
      }
      return session;
    }
  },
})