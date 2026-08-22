require('dotenv').config();

const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/db');
const initSocket = require('./config/socket');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const registrationRoutes = require('./routes/registration.routes');
const announcementRoutes = require('./routes/announcement.routes');

const app = express();
const httpServer = http.createServer(app);
const io = initSocket(httpServer);

// Make io available inside controllers via req.app.get('io')
app.set('io', io);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200: { description: Server and database status }
 */

app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "Welcome to EventPulse API",
        health: "/health",
        documentation: "/api-docs",
        events: "/api/events"
    });
});

app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    database: dbState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announcementRoutes);

app.use((req, res, next) => {
  res.status(404).json({ status: 'fail', message: 'Route not found' });
});

app.use(errorHandler);

async function start() {
  await connectDB();
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start()

module.exports = app;
