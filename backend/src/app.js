import express from 'express'
import config from './config/config.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'

const app = express()

app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}))

app.use(helmet())


const rateLimitHandler = asyncHandler(async (req, res) => {
  throw new ApiError(429, "Too many requests. Please try again later.")
})

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler
})

app.use(limiter)

// Stricter auth rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56,
  handler: rateLimitHandler

})

app.use('/v1/api/auth', authLimiter)
app.use('/v1/api/user', authLimiter)
// app.use('/v1/api/todo', authLimiter)



app.use(express.json({ limit: '1mb' }))

app.use(express.urlencoded({
  extended: true,
  limit: '1mb'
}))

app.use(express.static('./public'))

app.use(cookieParser())

// Route imports
import userRoutes from './routes/user.route.js'
import userManagementRoutes from './routes/userManagement.route.js'
import todoRoutes from './routes/todo.route.js'
import asyncHandler from './utils/asyncHandler.js'
import ApiResponse from './utils/ApiResponse.js'
import ApiError from './utils/ApiError.js'

// Routes
app.use('/v1/api/auth', userRoutes)
app.use('/v1/api/user', userManagementRoutes)
app.use('/v1/api/todo', todoRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: err.success || false,
    message: err.message || 'Something went wrong',
    errors: err.errors || []
  })
})

export default app