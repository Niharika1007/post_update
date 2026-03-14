import { Router } from "express"
import { verifyToken } from "../middleware/authMiddleware"
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} from "../controllers/postController"
import { checkRole } from "../middleware/roleMiddleware"

const router = Router()

// Create Post → author, editor, admin
router.post("/posts", verifyToken, checkRole(["author", "editor", "admin"]), createPost)

// Get all posts → any logged-in user
router.get("/posts", verifyToken, getPosts)

// Get single post
router.get("/posts/:id", verifyToken, getPostById)

// Update post → editor, admin
router.put("/posts/:id", verifyToken, checkRole(["editor", "admin"]), updatePost)

// Delete post → admin only
router.delete("/posts/:id", verifyToken, checkRole(["admin"]), deletePost)

export default router