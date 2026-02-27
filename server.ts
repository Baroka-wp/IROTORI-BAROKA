import express from "express";
import { createServer as createViteServer } from "vite";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // --- Auth Middleware ---
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // --- API Routes ---

  // Auth
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "password123";

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "24h" });
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
      return res.json({ success: true });
    }
    res.status(401).json({ error: "Invalid credentials" });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ user: null });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ user: decoded });
    } catch (err) {
      res.json({ user: null });
    }
  });

  // Posts
  app.get("/api/posts", async (req, res) => {
    const { type, status } = req.query;
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  });

  app.get("/api/posts/:slug", async (req, res) => {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  });

  app.post("/api/posts", authenticate, async (req, res) => {
    try {
      const post = await prisma.post.create({
        data: req.body,
      });
      res.json(post);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/posts/:id", authenticate, async (req, res) => {
    try {
      const post = await prisma.post.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json(post);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/posts/:id", authenticate, async (req, res) => {
    await prisma.post.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  });

  // Newsletter
  app.post("/api/subscribe", async (req, res) => {
    const { email } = req.body;
    try {
      await prisma.subscriber.create({ data: { email } });
      res.json({ success: true });
    } catch (err: any) {
      if (err.code === "P2002") {
        return res.json({ success: true, message: "Already subscribed" });
      }
      res.status(400).json({ error: err.message });
    }
  });

  app.get("/api/subscribers", authenticate, async (req, res) => {
    const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });
    res.json(subs);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
