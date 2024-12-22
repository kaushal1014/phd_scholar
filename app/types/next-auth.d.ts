// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string; // Add `id` to the user object
      email: string;
      name: string;
      isAdmin: boolean; // Add `isAdmin` to the user object
      isVerified: boolean; // Add `isVerified` to the user object
    };
  }

  interface JWT extends DefaultJWT {
    id: string; // Add `id` to JWT
    email: string;
    name: string;
    isAdmin: boolean; // Add `isAdmin` to JWT
    isVerified: boolean; // Add `isVerified` to JWT
  }
}
