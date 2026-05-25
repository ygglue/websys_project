import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User.js'

export interface AuthRequest extends Request {
  user?: IUser
}

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' })
    return
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Not authorized, token failed' })
  }
}

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' })
    return
  }
  next()
}

export default authMiddleware
