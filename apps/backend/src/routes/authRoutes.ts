import { Router } from "express"
import { register, login, refreshToken, logout } from "../controllers/authController"
import passport from "passport"
import jwt from "jsonwebtoken"

const router = Router()

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
  "auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req: any, res) => {

    const user = req.user

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    )

    res.json({
      message: "Google login success",
      accessToken,
      user
    })
  }
)

router.post("/register", register)
router.post("/login", login)
router.post("/refresh", refreshToken)
router.post("/logout", logout)

export default router