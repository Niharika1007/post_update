import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  updatePostStatus
} from "../controllers/postController.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import db from "../config/db.js";

const router = Router();

// ✅ PUBLIC BLOG LIST (NO AUTH)
router.get("/posts", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM posts`);
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ PUBLIC — ONLY PUBLISHED POSTS
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, title, slug 
      FROM posts 
      WHERE status='PUBLISHED'
      AND published_at IS NOT NULL
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("❌ DB ERROR:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ GET BY SLUG
router.get("/slug/:slug", async (req, res) => {
  try {
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
  } catch (error) {
    console.error("❌ Slug fetch error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔐 PROTECTED ROUTES

router.post(
  "/posts",
  verifyToken,
  checkRole(["author", "editor", "admin"]),
  async (req, res) => {
    try {
      await createPost(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Create failed" });
    }
  }
);

router.get("/posts/:id", verifyToken, async (req, res) => {
  try {
    await getPostById(req, res);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

router.put(
  "/posts/:id",
  verifyToken,
  checkRole(["editor", "admin"]),
  async (req, res) => {
    try {
      await updatePost(req, res);
    } catch (error) {
      res.status(500).json({ error: "Update failed" });
    }
  }
);

router.put(
  "/posts/:id/status",
  verifyToken,
  checkRole(["editor", "admin"]),
  async (req, res) => {
    try {
      await updatePostStatus(req, res);
    } catch (error) {
      res.status(500).json({ error: "Status update failed" });
    }
  }
);

router.delete(
  "/posts/:id",
  verifyToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      await deletePost(req, res);
    } catch (error) {
      res.status(500).json({ error: "Delete failed" });
    }
  }
);

export default router;