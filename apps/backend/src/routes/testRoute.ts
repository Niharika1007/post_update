import { Router } from "express"
import pool  from "../config/db"

const router = Router()

router.get("/db", async (req, res) => {
  const result = await pool.query("SELECT NOW()")
  res.json(result.rows)
})

export default router