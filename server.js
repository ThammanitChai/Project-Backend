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

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();

/* ===========================
   🔥 FIX สำคัญที่สุด (กัน crash)
=========================== */
app.set('trust proxy', 1); // ✅ แก้ express-rate-limit crash

/* ===========================
   🔥 CORS FIX
=========================== */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// preflight fix
app.options("*", cors());

/* ===========================
   Middleware
=========================== */
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

/* ===========================
   Rate Limit (ตอนนี้ไม่ crash แล้ว)
=========================== */
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(hpp());

/* ===========================
   Routes
=========================== */
app.use('/api/v1/spaces', spaces);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/spaces/:spaceId/reservations', reservations);
app.use('/api/v1/auth', auth);

/* ===========================
   Health Check
=========================== */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀"
  });
});

/* ===========================
   Server Start
=========================== */
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* ===========================
   Error Handler
=========================== */
process.on('unhandledRejection', (err) => {
  console.error(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});