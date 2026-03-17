import { Router } from "express"
import { getPostBySlug, getPublishedPosts } from "../controllers/postController"

const router = Router()

// Public blog list
router.get("/blog", getPublishedPosts)

// Public blog post
router.get("/blog/:slug", getPostBySlug)

export default router