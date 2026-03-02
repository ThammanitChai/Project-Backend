const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const {xss}= require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const spaces = require('./routes/spaces');
const reservations = require('./routes/reservations');
const auth = require('./routes/auth');

dotenv.config({ path: './config/config.env'});
connectDB();

const app = express();

app.set('query parser', 'extended');

// Body parser
app.use(express.json());

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
                url: 'http://localhost:5004/api/v1',
            }
        ],
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Cookie Parser
app.use(cookieParser());

app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 mins
    max: 100
});

app.use(limiter);

app.use(hpp());
app.use(cors());

// Mount routers
app.use('/api/v1/spaces', spaces);
app.use('/api/v1/reservations', reservations);
app.use('/api/v1/spaces/:spaceId/reservations', reservations);
app.use('/api/v1/auth', auth);

const PORT = process.env.PORT || 5004;

const server = app.listen(
  PORT,
  console.log('Server running in', process.env.NODE_ENV, 'mode on port', PORT)
);

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(()=> process.exit(1));
});
