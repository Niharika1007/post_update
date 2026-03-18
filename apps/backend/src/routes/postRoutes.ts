import { Router } from "express"
import { verifyToken } from "../middleware/authMiddleware"
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  updatePostStatus
} from "../controllers/postController"
import { checkRole } from "../middleware/roleMiddleware"
import db from "../config/db"
const router = Router()

// Create Post → author, editor, admin
router.post(
  "/posts",
  verifyToken,
  checkRole(["author", "editor", "admin"]),
  createPost
)

// Get all posts → any logged-in user
router.get("/posts", verifyToken, getPosts)

// Get single post
router.get("/posts/:id", verifyToken, getPostById)

router.get("/slug/:slug", async (req, res) => {
  const { slug } = req.params;

  const post = await db.query(
    `SELECT * FROM posts 
     WHERE slug = $1 
     AND status = 'PUBLISHED'
     AND published_at IS NOT NULL`,
    [slug]
  );

  if (!post.rows.length) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(post.rows[0]);
});

// Update post → editor, admin
router.put(
  "/posts/:id",
  verifyToken,
  checkRole(["editor", "admin"]),
  updatePost
)

// Update post status → editor, admin
router.put(
  "/posts/:id/status",
  verifyToken,
  checkRole(["editor", "admin"]),
  updatePostStatus
)

// Delete post → admin only
router.delete(
  "/posts/:id",
  verifyToken,
  checkRole(["admin"]),
  deletePost
)

router.get("/", async (req, res) => {
  const result = await db.query(
    `SELECT id, title, slug 
     FROM posts 
     WHERE status='PUBLISHED'
     AND published_at IS NOT NULL`
  );

  res.json(result.rows);
});

export default router