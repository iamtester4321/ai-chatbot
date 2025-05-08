import passport from "passport";
import { env } from "../config/env";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { signToken } from "../utils/token.util"; // wherever your signToken lives
import { findOrCreateUser } from "../services/user.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (_, __, profile, done) => {
      try {
        // your logic to find or create a user in DB:
        const user = await findOrCreateUser({
          googleId: profile.id,
          email: profile.emails?.[0].value!,
          name: profile.displayName,
        });

        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);

// optional, if you use sessions
/* 
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id: string, done) => {
  const user = await getUserById(id);
  done(null, user);
}); */
