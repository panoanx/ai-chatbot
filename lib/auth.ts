import NextAuth, { type DefaultSession } from 'next-auth'
import AuthentikProvider from 'next-auth/providers/authentik'
import SlackProvider from 'next-auth/providers/slack'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth
  // CSRF_experimental // will be removed in future
} = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  providers: [
    AuthentikProvider({
      clientId: process.env.AUTHENTIK_CLIENT_ID || '',
      clientSecret: process.env.AUTHENTIK_CLIENT_SECRET || '',
      issuer: process.env.AUTHENTIK_ISSUER
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  callbacks: {
    jwt({ token, profile }) {
      // error after update next-auth
      // if (profile) {
      //   token.id = profile.id
      //   token.image = profile.avatar_url || profile.picture
      // }
      return token
    },
    // @ts-ignore
    signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === 'google') {
        return profile?.email_verified
      }
      return true
    },
    session({ session, token }) {
      session.user.id = token.sub ?? ''
      // session.user.image = token.image
      return session
    }
    // authorized({ auth }) {
    //   return !!auth?.user // this ensures there is a logged in user for -every- request
    // }
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  }
})
