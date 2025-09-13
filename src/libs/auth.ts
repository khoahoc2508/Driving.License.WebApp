// Third-party Imports
import CONFIG from '@/configs/config'
import type { NextAuthOptions } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      // ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
      name: 'Credentials',
      type: 'credentials',

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {},
      async authorize(credentials) {
        /*
         * You need to provide your own logic here that takes the credentials submitted and returns either
         * an object representing a user or value that is false/null if the credentials are invalid.
         * For e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
         * You can also use the `req` object to obtain additional parameters (i.e., the request IP address)
         */
        const { username, password } = credentials as { username: string; password: string }

        try {
          const params = new URLSearchParams()

          params.append('username', username)
          params.append('password', password)
          params.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID!)
          params.append('client_secret', process.env.NEXT_PUBLIC_CLIENT_SECRET!)
          params.append('grant_type', 'password')

          // ** Login API Call to match the user credentials and receive user data in response along with his role
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connect/token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
          })

          const data = await res.json()

          if (res.status === 401) {
            throw new Error(JSON.stringify(data))
          }

          if (res.status === 200) {
            /*
             * Please unset all the sensitive information of the user either from API response or before returning
             * user data below. Below return statement will set the user object in the token and the same is set in
             * the session which will be accessible all over the app.
             */

            const userInfoRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connect/userinfo`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${data?.access_token}`
              }
            })

            const userInfo = await userInfoRes.json()

            return {
              access_token: data?.access_token,
              refresh_token: data?.refresh_token,
              expires_in: data?.expires_in,
              name: userInfo?.name,
              email: userInfo?.email,
              id: userInfo?.sub,
              role: userInfo?.role,
              username: userInfo?.username
            } as any
          }

          return null
        } catch (e: any) {
          throw new Error(e.message)
        }
      }
    })
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 30 * 24 * 60 * 60 // ** 30 days,
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: CONFIG.Routers.Login
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */
    async jwt({ token, user }: any) {
      // Initial sign in
      if (user) {
        token.name = user.name
        token.accessToken = user.access_token
        token.refreshToken = user.refresh_token
        token.accessTokenExpires = Date.now() + (user.expires_in ? Number(user.expires_in) * 1000 : 60 * 60 * 1000)
        token.role = user.role
        token.username = user.username

        return token
      }

      // If the access token has not expired yet, return it
      if (token.accessToken && token.accessTokenExpires && Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, try to update it using refresh token
      try {
        const params = new URLSearchParams()

        params.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID!)
        params.append('client_secret', process.env.NEXT_PUBLIC_CLIENT_SECRET!)
        params.append('grant_type', 'refresh_token')
        params.append('refresh_token', String(token.refreshToken ?? ''))

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connect/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString()
        })

        const refreshed = await res.json()

        if (!res.ok) {
          throw new Error(JSON.stringify(refreshed))
        }

        token.accessToken = refreshed.access_token
        token.refreshToken = refreshed.refresh_token ?? token.refreshToken
        token.accessTokenExpires = Date.now() + Number(refreshed.expires_in ?? 3600) * 1000
        delete token.error

        return token
      } catch (error) {
        token.error = 'Mời bạn đăng nhập lại'

        return token
      }
    },
    async session({ session, token }) {
      session.accessToken = (token.accessToken as string) + ''

      // @ts-ignore
      session.error = token.error

      if (session.user) {
        // ** Add custom params to user in session which are added in `jwt()` callback via `token` parameter
        session.user.name = token.name
        session.user.id = token.sub
        session.user.role = token.role
        session.user.username = token.username
      }

      return session
    }
  }
}
