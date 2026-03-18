import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import passport from "passport";

import testRoute from "./routes/testRoute";
import authRoutes from "./routes/authRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import postRoutes from "./routes/postRoutes";
import blogRoutes from "./routes/blogRoutes";
import googleAuthRoutes from "./routes/googleAuthRoutes";

import "./config/googleAuth";
// import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();

// ✅ Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(helmet());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use(express.json());
app.use(passport.initialize());

// ✅ Routes
app.use("/", testRoute);

app.use("/api", postRoutes);
app.use("/api", blogRoutes);
app.use("/api", dashboardRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);

// ✅ Health
app.get("/", (req: Request, res: Response) => {
  res.send("CMS Backend Running");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK" });
});

// ❗ Disable temporarily for debugging
// app.use(errorHandler);

const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});