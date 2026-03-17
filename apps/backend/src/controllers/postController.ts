import { Request, Response } from "express"
import { pool } from "../config/db"
import slugify from "slugify"

export const updatePostStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const result = await pool.query(
      "UPDATE posts SET status=$1 WHERE id=$2 RETURNING *",
      [status, id]
    )

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: "Error updating post status" })
  }
}
export const createPost = async (req: any, res: Response) => {
  try {
    const { title, content, status } = req.body
    const authorId = req.user.id

    const slug = slugify(title, { lower: true, strict: true })

    const result = await pool.query(
      `INSERT INTO posts (title, slug, content, status, author_id)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [title, slug, content, status || "draft", authorId]
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error creating post" })
  }
}

export const getPosts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM posts ORDER BY id DESC")
    res.json(result.rows)
  } catch {
    res.status(500).json({ message: "Error fetching posts" })
  }
}

export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      "SELECT * FROM posts WHERE id=$1",
      [id]
    )

    res.json(result.rows[0])
  } catch {
    res.status(500).json({ message: "Error fetching post" })
  }
}

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params

    const result = await pool.query(
      "SELECT * FROM posts WHERE slug=$1 AND status='published'",
      [slug]
    )

    if (!result.rows.length) {
      return res.status(404).json({ message: "Post not found" })
    }

    res.json(result.rows[0])
  } catch {
    res.status(500).json({ message: "Error fetching post" })
  }
}

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, content, status } = req.body

    const result = await pool.query(
      `UPDATE posts
       SET title=$1, content=$2, status=$3
       WHERE id=$4
       RETURNING *`,
      [title, content, status, id]
    )

    res.json(result.rows[0])
  } catch {
    res.status(500).json({ message: "Error updating post" })
  }
}

export const getPublishedPosts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM posts WHERE status='published' ORDER BY created_at DESC"
    )

    res.json(result.rows)
  } catch {
    res.status(500).json({ message: "Error fetching blog posts" })
  }
}

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await pool.query(
      "DELETE FROM posts WHERE id=$1",
      [id]
    )

    res.json({ message: "Post deleted" })
  } catch {
    res.status(500).json({ message: "Error deleting post" })
  }
}