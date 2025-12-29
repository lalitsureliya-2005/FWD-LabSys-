import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import passport from "./auth";
import { storage } from "./storage";
import { PublicUser, User } from "@shared/userSchema";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {

  // Auth Routes
  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    const user = req.user as User;
    const publicUser: PublicUser = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
    res.json(publicUser);
  });

  app.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

  app.get("/api/me", isAuthenticated, (req, res) => {
    const user = req.user as User;
    const publicUser: PublicUser = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
    res.json(publicUser);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const existingUser = await storage.findUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const user = await storage.createUser({ username, password });
      
      const publicUser: PublicUser = {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      };

      res.status(201).json(publicUser);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/lab-tests", isAuthenticated, async (req, res, next) => {
    try {
      const labTests = await storage.getLabTests();
      res.json(labTests);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/lab-tests", isAuthenticated, async (req, res, next) => {
    try {
      const labTest = await storage.createLabTest(req.body);
      res.status(201).json(labTest);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/lab-tests/:id", isAuthenticated, async (req, res, next) => {
    try {
      const labTest = await storage.getLabTest(req.params.id);
      if (labTest) {
        res.json(labTest);
      } else {
        res.status(404).json({ message: "Lab test not found" });
      }
    } catch (error) {
      next(error);
    }
  });


  const httpServer = createServer(app);

  return httpServer;
}
