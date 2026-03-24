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
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const spaces = require('./routes/spaces');
const reservations = require('./routes/reservations');
const auth = require('./routes/auth');

// ❗ Railway ไม่ใช้ .env file (ใช้ Variables แทน)
// แต่เก็บไว้ก็ไม่ผิด
dotenv.config();

connectDB();

const app = express();

app.set('query parser', 'extended');

// Body parser
app.use(express.json());

// ✅ เพิ่ม root route กัน 502
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running 🚀'
  });
});

// Swagger
const swaggerOptions = { 
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'FriskyDepp API',
      version: '1.0.0',
      description: 'API documentation for VacQ project'
    },
    servers: [
      {
        // ❗ ไม่ใช้ localhost ใน production
        url: process.env.BASE_URL || 'http://localhost:5004/api/v1',
      },
    ],
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
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
app.use(cors());

// Routes
app.use('/api/v1/spaces', spaces);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/spaces/:spaceId/reservations', reservations);
app.use('/api/v1/auth', auth);

// ❗ สำคัญที่สุดสำหรับ Railway
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Error handler
process.on('unhandledRejection', (err) => {
  console.log(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});