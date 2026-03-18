import passport from "passport"
import pool  from "../config/db"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {

      const email = profile.emails?.[0].value

      const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      )

      let user = result.rows[0]

      if (!user) {
        const newUser = await pool.query(
          "INSERT INTO users(email) VALUES($1) RETURNING *",
          [email]
        )
        user = newUser.rows[0]
      }

      done(null, user)
    }
  )
)