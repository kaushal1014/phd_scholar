import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import connectDB from "@/server/db";
import User from "@/server/models/userModel";


// Connect to the database
connectDB();

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Check if password matches
        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // Return the user object if valid
        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified,
        };
      },
    }),
  ],
  session: {
    // The session will expire after 20 minutes of inactivity
    maxAge: 20 * 60, // 20 minutes in seconds
    updateAge: 10 * 60,
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isAdmin = user.isAdmin;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user = session.user || {};
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.isAdmin = token.isAdmin;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
