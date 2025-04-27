/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Here you write your own login logic (check database, etc.)

        if (credentials?.email === "admin@example.com" && credentials?.password === "password") {
          return { id: "1", name: "Admin", email: "admin@example.com" };
        }
        
        return null;
      }
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT tokens
  },
  secret: process.env.NEXTAUTH_SECRET, // Add this secret in your .env
});

export { handler as GET, handler as POST };
