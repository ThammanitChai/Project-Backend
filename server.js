const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Routes
const spaces = require('./routes/spaces');
const reservations = require('./routes/reservations');
const auth = require('./routes/auth');

// Load ENV
dotenv.config();

// Connect DB
connectDB();

const app = express();

/* ==============================
   🔥🔥 CORS FIX (ตัวสำคัญสุด)
================================ */
const corsOptions = {
  origin: "*", // เอาชัวร์ ใช้ได้ทุก domain (dev + vercel)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// ใช้ cors ปกติ
app.use(cors(corsOptions));

// 🔥 แก้ preflight request (สำคัญมาก)
app.options("*", cors(corsOptions));

/* ==============================
   Middleware
================================ */

// Body parser
app.use(express.json());

// Security
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});
app.use(limiter);
app.use(hpp());

/* ==============================
   Routes
================================ */
app.use('/api/v1/spaces', spaces);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/spaces/:spaceId/reservations', reservations);
app.use('/api/v1/auth', auth);

/* ==============================
   Health Check
================================ */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀"
  });
});

/* ==============================
   Server Start
================================ */
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* ==============================
   Error Handler
================================ */
process.on('unhandledRejection', (err) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});