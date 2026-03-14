import { Request, Response, NextFunction } from "express"

export const checkRole = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {

    const userRole = req.user.role

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied"
      })
    }

    next()
  }
}