import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import { pool } from "../config/db"

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body

    // check if user exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const userRole = role || "author"

    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1,$2,$3) RETURNING id,email,role",
      [email, hashedPassword, userRole]
    )

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: "Registration failed" })
  }
}

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
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

    // ACCESS TOKEN
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    )

    // REFRESH TOKEN
    const refreshToken = uuidv4()

    await pool.query(
      "UPDATE users SET refresh_token=$1 WHERE id=$2",
      [refreshToken, user.id]
    )

    res.json({
      accessToken,
      refreshToken
    })
  } catch {
    res.status(500).json({ message: "Login failed" })
  }
}

// REFRESH TOKEN
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token required" })
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE refresh_token=$1",
      [refreshToken]
    )

    const user = result.rows[0]

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" })
    }

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    )

    res.json({ accessToken: newAccessToken })
  } catch {
    res.status(500).json({ message: "Token refresh failed" })
  }
}

// LOGOUT
export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    await pool.query(
      "UPDATE users SET refresh_token=NULL WHERE refresh_token=$1",
      [refreshToken]
    )

    res.json({ message: "Logged out successfully" })
  } catch {
    res.status(500).json({ message: "Logout failed" })
  }
}