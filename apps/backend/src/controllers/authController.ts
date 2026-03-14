import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { pool } from "../config/db"

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  // if role not provided → default author
  const userRole = role || "author"

  const result = await pool.query(
    "INSERT INTO users (email, password, role) VALUES ($1,$2,$3) RETURNING id,email,role",
    [email, hashedPassword, userRole]
  )

  res.json(result.rows[0])
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  )

  const user = result.rows[0]

  if (!user) {
    return res.status(400).json({ message: "User not found" })
  }

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  )

  res.json({ token })
}