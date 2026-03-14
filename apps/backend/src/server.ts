import express from "express"
import cors from "cors"
import helmet from "helmet"
import testRoute from "./routes/testRoute"
import authRoutes from "./routes/authRoutes"
import dashboardRoutes from "./routes/dashboardRoutes"
import postRoutes from "./routes/postRoutes"
import blogRoutes from "./routes/blogRoutes"

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.use("/api", blogRoutes)
app.use("/api", postRoutes)
app.use("/api", dashboardRoutes)
app.use("/api/auth", authRoutes)
app.use("/api", testRoute)

app.get("/", (req, res) => {
  res.send("CMS Backend Running")
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})