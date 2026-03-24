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

// 🔥🔥🔥 CORS (สำคัญสุด)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://front-project-9145.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 🔥 fallback (กันพัง)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// Body parser
app.use(express.json());

// Security middleware
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

// Routes
app.use('/api/v1/spaces', spaces);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/spaces/:spaceId/reservations', reservations);
app.use('/api/v1/auth', auth);

// ✅ health check (สำคัญมาก)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀"
  });
});

// PORT (Railway ต้องใช้ process.env.PORT)
const PORT = process.env.PORT || 8080;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});