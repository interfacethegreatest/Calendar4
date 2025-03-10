import NextAuth, { Account, Profile, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { JWT } from 'next-auth/jwt';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from '@/utils/connectDB';
import UserModal from '@/models/User';
import bcrypt from 'bcryptjs';
import axios from 'axios';

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await UserModal.findOne({ email: credentials!.email });
        if (!user) {
          throw new Error('Email is not registered.');
        }
        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isPasswordCorrect) {
          throw new Error('Password is incorrect.');
        }
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }: {
      token: JWT;
      user?: User | Adapter | undefined;
      account?: Account | null | undefined;
      profile?: Profile | undefined;
      isNewUser?: boolean | undefined;
    }) {
      if (user) {
        token.provider = account?.provider;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.provider = token.provider;
        try {
          await connectDB();
          const userDB = await UserModal.findById(token.sub).exec();
          if ( userDB ) {
            // check that userDB.emailverified is not null
            const isNewUser = (userDB.emailVerified === null );
            // console log the result 
              if ( isNewUser ) {
                await axios.post(`${process.env.NEXTAUTH_URL}/api/auth/checkUser`, { token: token.sub });
              }
            
          }
          session.id = userDB.id;
          session.isNewUser = userDB.emailVerified.isNewUser;
          session.description = userDB.Biography;
          session.username = userDB.name;
          session.image = userDB.image;
        } catch (error: any) {
          console.log(error.message);
        }
      }
      return session;
    },
  },
});
