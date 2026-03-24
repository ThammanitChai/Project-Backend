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

const spaces = require('./routes/spaces');
const reservations = require('./routes/reservations');
const auth = require('./routes/auth');

// ✅ โหลด ENV
dotenv.config();

// ✅ connect database
connectDB();

const app = express();

// ✅ สำคัญมาก (แก้ CORS ตรงนี้)
app.use(cors({
  origin: "*", // ใช้ง่ายสุดตอน dev
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

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

// Routes
app.use('/api/v1/spaces', spaces);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/spaces/:spaceId/reservations', reservations);
app.use('/api/v1/auth', auth);

// Root test route (เอาไว้เช็คว่า server ยังอยู่)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// PORT
const PORT = process.env.PORT || 8080;

// start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// handle error
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});