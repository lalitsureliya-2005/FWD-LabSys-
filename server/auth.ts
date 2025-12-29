import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import { User } from "@shared/userSchema";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.findUserByUsername(username);
      if (!user || !user.passwordHash) {
        return done(null, false, { message: "Incorrect username or password." });
      }
      const isValid = await storage.verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return done(null, false, { message: "Incorrect username or password." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;