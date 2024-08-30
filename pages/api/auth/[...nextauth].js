import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  session: {
    // This session object is crucial for defining how sessions are handled,
    // including their creation, validation, and expiration.
    strategy: "jwt", //strategy: "database" for stateful sessions
    maxAge: 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Appinventiv",

      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      // credentials: {
      //   username: { label: "Username", type: "text", placeholder: "jsmith" },
      //   password: { label: "Password", type: "password" }
      // },

      authorize: async (credentials) => {
        //authorize is a method that next-auth calls for incoming login request
        //as an argument to this method, we get the submitted credentials
        //its a async mehod, so returns a promise
        const { email, password } = credentials;
        let user;
        try {
          user = await axios.post(
            "https://alpha-dev-api.appskeeper.in/alpha/v1/accounts/login",
            {
              email: email,
              password: password,
            },
            {
              headers: {
                Authorization: "Basic QUxQSEFfVVNFUjpBTFBIQV9QV0Q=",
              },
            }
          );
          // User Object: Should contain at least an id, name, and email.
          // Any object returned will be saved in `user` property of the JWT
          user = {
            id: `user-${Math.random()}app`,
            data: user.data,
          };
          return user; //to encode this object in JWT, we have used session: { jwt: true }
        } catch (e) {
          console.log("Error:", e);
          return null;
        }
      },
    }),
    // ...add more providers here
  ],

  // The secret key is used to sign and encrypt tokens, ensuring the security of your authentication process.
  secret: "any secret key",

  // NextAuth.js automatically creates simple, unbranded authentication pages for handling Sign in, Sign out, Email Verification and displaying error messages.
  // To add a custom login page, you can use the pages option.
  pages: {
    signIn: "/auth",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // token: This is the current JWT token. It contains the data that will be stored in the token and sent to the client.
      //        You can modify this object to include additional information.
      // user: This object contains user information and is only available the first time the callback is called,
      //       i.e., when the user signs in. It includes details like id, name, email, etc.
      // account: This object contains information about the authentication provider (e.g., Google, GitHub)
      //       and is also only available the first time the callback is called.
      //       It includes details like access_token, provider, etc.

      if (account && user) {
        console.log("JWT: ", token, user, account);
        token.id = user.id;
        token.auth_token = user.data.result.authToken;
        token.refresh_token = user.data.result.refreshToken;
        token.role = "user";
      }
      return token;

      // First Sign-In: On the first sign-in, you can add user and account information to the token.
      // Subsequent Requests: On subsequent requests, only the token parameter is available,
      // allowing you to update or read the token as needed.
    },

    async session({ session, token }) {
      // session: This object represents the user’s session.
      // By default, only a subset of the token data is included in the session for security reasons.
      // However, if you want to make additional information available (such as an access_token or user.id),
      // you can explicitly forward it from the jwt callback to the session callback.

      session.authToken = token.auth_token;
      session.refreshToken = token.refresh_token;
      session.id = token.id;
      return session;
    },
  },
};

export default NextAuth(authOptions);

//sample for google signin
// const options2 = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async signIn({ account, profile }) {
//       // Google also returns a email_verified boolean property in the OAuth profile.
//       // You can use this property to restrict access to people with verified accounts at a particular domain.
//       if (account.provider === "google") {
//         return profile.email_verified && profile.email.endsWith("@example.com");
//       }
//       return true; // Do different verification for other providers that don't have `email_verified`
//     },
//   },
// };
