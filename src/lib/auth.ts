import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        try {
          const admin = await prisma.admin.findUnique({
            where: { email: email.toLowerCase().trim() },
          });

          if (!admin) {
            console.warn(`[AUTH] Failed login attempt for non-existent admin: ${email}`);
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, admin.hashedPassword);

          if (!passwordsMatch) {
            console.warn(`[AUTH] Invalid password attempt for admin: ${email}`);
            return null;
          }

          return {
            id: admin.id,
            email: admin.email,
            name: admin.name || 'Admin',
          };
        } catch (error) {
          console.error('[AUTH] Database error during authentication:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = 'ADMIN';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        (session.user as { role?: string }).role = (token.role as string) || 'ADMIN';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'laptop-collection-secret-key-32charsmin',
});
