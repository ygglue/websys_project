import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { AuthRequest } from '../middleware/auth.js'

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '30d' })
}

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    const exists = await User.findOne({ email })
    if (exists) {
      res.status(400).json({ message: 'Email already registered' })
      return
    }
    const user = await User.create({ name, email, password })
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' })
      return
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = req.user
  res.json({
    _id: user!._id,
    name: user!.name,
    email: user!.email,
    role: user!.role,
  })
}
