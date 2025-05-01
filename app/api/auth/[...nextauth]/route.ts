/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      position?: string | null;
      image?: string | null;
      provider?: string; // Add provider information to track auth method
    };
  }
}

const handler = NextAuth({
  // Remove the PrismaAdapter as the default adapter
  // Use it conditionally only for credential authentication
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          // First find the user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { userAuth: true }
          });
          
          if (!user || !user.userAuth || user.userAuth.length === 0) {
            console.log("User not found or no auth record");
            return null;
          }
          
          // Check if password matches - in a production app, you'd compare hashed passwords
          const auth = user.userAuth.find(auth => auth.password === credentials.password);
          
          if (auth) {
            return {
              id: user.id,
              name: user.fullName || `${user.firstName} ${user.lastName}`,
              email: user.email,
              provider: "credentials"
            };
          }
          
          console.log("Password did not match");
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google accounts, always return true to allow sign in without database check
      if (account?.provider === "google") {

        const u = await prisma.user.findUnique({
          where: { email: user.email || "" },
        });
        if(u){
          return true;
        }
        return false;
      }
      
      // For credentials, we've already checked in the authorize function
      if (account?.provider === "credentials") {
        return true;
      }
      
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
          
        }
        
        // Add the provider to the session
        if (token.provider) {


          const user = await prisma.user.findUnique({
            where: { email: session.user.email || "" },
            include: { userAuth: true }
          });



          session.user.name = user?.fullName || `${user?.firstName} ${user?.lastName}` || null;
          session.user.position = user?.position || null;
          session.user.provider = token.provider as string;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      
      // Store the provider in the token
      if (account) {
        token.provider = account.provider;
      }
      
      return token;
    }
  },
  session: {
    strategy: "jwt", // Use JWT tokens
  },
  secret: process.env.NEXTAUTH_SECRET, // Add this secret in your .env
  pages: {
    signIn: '/login',
    error: '/login', // Add this to handle errors
  }
});

export { handler as GET, handler as POST };
