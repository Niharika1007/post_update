import { Router } from "express"
import { getPostBySlug } from "../controllers/postController"

const router = Router()

router.get("/blog/:slug", getPostBySlug)

export default router