// require express framework
const express = require("express");
const path = require('path');
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

dotenv.config({ path: "config.env" });

// Routes
const mountRoutes = require('./routes');
const { webhookCheckout } = require('./services/orderService');
const dbConnection = require("./config/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
// Connect with db
dbConnection();

const app = express();
// Sercurity xss
app.use(xss());
// Enable other domains to access ours application
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.options('*', cors());
app.use(cookieParser());
//// compress all responses
app.use(compression());
// Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// Middlewares
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      'price',
      'sold',
      'quantity',
      'ratingsAverage',
      'ratingsQuantity',
    ],
  })
);

// Apply the rate limiting middleware to all requests
app.use('/api', limiter);
// Mount Route
mountRoutes(app);
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});
// Global error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Hanle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandleRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shuting down....`);
    process.exit(1);
  });
});
