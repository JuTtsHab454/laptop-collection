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

        const normalizedEmail = email.toLowerCase().trim();

        // 1. Attempt database authentication
        try {
          const admin = await prisma.admin.findUnique({
            where: { email: normalizedEmail },
          });

          if (admin) {
            const passwordsMatch = await bcrypt.compare(password, admin.hashedPassword);

            if (passwordsMatch) {
              return {
                id: admin.id,
                email: admin.email,
                name: admin.name || 'Super Admin',
              };
            }
          }
        } catch (error) {
          console.warn('[AUTH] Database error or Admin table not found yet:', error);
        }

        // 2. Fallback / Bootstrap Admin:
        // Ensures login always succeeds with master credentials, even if Neon DB tables are pending creation.
        const validAdminEmails = [
          'admin@laptopcollection.pk',
          'juttshab4512@gmail.com',
          process.env.ADMIN_EMAIL?.toLowerCase().trim(),
        ].filter(Boolean) as string[];

        const validAdminPasswords = [
          'Admin@LC2024!',
          process.env.ADMIN_PASSWORD,
        ].filter(Boolean) as string[];

        const isEmailMatch = validAdminEmails.includes(normalizedEmail);
        const isPasswordMatch = validAdminPasswords.includes(password);

        if (isEmailMatch && isPasswordMatch) {
          // If database is reachable, attempt to persist this admin in background
          try {
            const hashedPassword = await bcrypt.hash(password, 12);
            await prisma.admin.upsert({
              where: { email: normalizedEmail },
              update: {},
              create: {
                email: normalizedEmail,
                name: normalizedEmail.includes('jutt') ? 'JuTtsHab Admin' : 'Super Admin',
                hashedPassword,
              },
            });
          } catch {
            // Silently continue if table is not created yet
          }

          return {
            id: 'admin-bootstrap-root',
            email: normalizedEmail,
            name: normalizedEmail.includes('jutt') ? 'JuTtsHab Admin' : 'Super Admin',
          };
        }

        console.warn(`[AUTH] Invalid credentials for: ${normalizedEmail}`);
        return null;
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
