import { initializeDb } from "@/lib/database";
import { registerUser } from "@/lib/register-user";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { runMigrations } from "./migrations";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // console.log(user, account, profile);
      try {
        await initializeDb();
        await runMigrations();
        await registerUser(user);
      } catch (error) {
        console.log("@here error registering user");
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
