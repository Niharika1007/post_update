import { Router, Response } from "express"
import { verifyToken } from "../middleware/authMiddleware"
import { Request } from "express"

interface AuthRequest extends Request {
  user?: any
}

const router = Router()

router.get("/dashboard", verifyToken, (req: AuthRequest, res: Response) => {
  res.json({
    message: "Protected route",
    user: req.user
  })
})

export default router