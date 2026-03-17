import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import testRoute from "./routes/testRoute"
import authRoutes from "./routes/authRoutes"
import dashboardRoutes from "./routes/dashboardRoutes"
import postRoutes from "./routes/postRoutes"
import blogRoutes from "./routes/blogRoutes"
import { errorHandler } from "./middleware/errorHandler"
import passport from "passport"
import "./config/googleAuth"
import googleAuthRoutes from "./routes/googleAuthRoutes"

const app = express()

// Security Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

app.use(limiter)

// Body parser
app.use(express.json())

// Routes
app.use("/api", blogRoutes)
app.use("/api", postRoutes)
app.use("/api", dashboardRoutes)
app.use("/api/auth", authRoutes)
app.use("/api", testRoute)
app.use("/api/auth",googleAuthRoutes)

// Error Handler
app.use(errorHandler)

app.use(passport.initialize())

app.get("/", (req, res) => {
  res.send("CMS Backend Running")
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get("/health", (req, res) => {
  res.json({ status: "OK" })
})