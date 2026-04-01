import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import type { Adapter } from 'next-auth/adapters'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Nodemailer from 'next-auth/providers/nodemailer'
import { db } from '@/infrastructure/db/prisma'
import { env } from '@/env'
import type { UserRole } from '@/domain/value-objects/UserRole'
import { createValidateCredentialsUseCase } from '@/infrastructure/config/container'
import { resend } from '@/infrastructure/services/email/resend'
import { render } from '@react-email/components'
import { MagicLinkEmail } from '@/infrastructure/services/email/magic-link-email'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/inloggen',
    verifyRequest: '/inloggen/verify-request',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Wachtwoord', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string
        if (!email || !password) return null

        try {
          const useCase = createValidateCredentialsUseCase()
          const user = await useCase.execute({ email, password })
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch {
          return null
        }
      },
    }),
    Nodemailer({
      server: {},
      from: env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        if (!resend) {
          console.warn('[auth] Resend not configured, magic link URL:', url)
          return
        }
        const html = await render(MagicLinkEmail({ url }))
        await resend.emails.send({
          from: env.EMAIL_FROM,
          to: email,
          subject: 'Inloggen bij Plattelandsbon',
          html,
        })
      },
    }),
    ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
      ? [Google({
          clientId: env.AUTH_GOOGLE_ID,
          clientSecret: env.AUTH_GOOGLE_SECRET,
          allowDangerousEmailAccountLinking: true,
        })]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: UserRole }).role
      }
      if (trigger === 'update' && token.id) {
        const dbUser = await db.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        })
        if (dbUser) token.role = dbUser.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
})
