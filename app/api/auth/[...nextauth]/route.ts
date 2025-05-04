import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Add the session type extension here
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      position?: string | null;
      image?: string | null;
      provider?: string;
    };
  }
}

// Create the handler using the auth options from the separate file
const handler = NextAuth(authOptions);

// Export the GET and POST handlers for Next.js App Router
export { handler as GET, handler as POST };
