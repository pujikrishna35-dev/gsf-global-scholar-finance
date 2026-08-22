import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import dashboardRoutes from './routes/dashboard.routes';
import followupRoutes from './routes/followup.routes';
import notificationRoutes from './routes/notification.routes';
import otpRoutes from './routes/otp.routes';
import settingsRoutes from './routes/settings.routes';
import studentRoutes from './routes/student.routes';
import { setSocketServer } from './services/notification.service';
import { initDatabase } from './config/database';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = '0.0.0.0';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  }
});

// Pass Socket.IO instance to notification service
setSocketServer(io);

io.on('connection', (socket) => {
  console.log(`⚡ Client connected to WebSocket: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Production & Local Development CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://gsf-global-scholar-finance-production.up.railway.app',
  'http://gsf-global-scholar-finance-production.up.railway.app',
  process.env.CLIENT_URL,
  process.env.PUBLIC_WEBSITE_URL,
  process.env.ADMIN_DASHBOARD_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or allowed origins
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());

// API Route Registration
app.use('/api/auth', authRoutes);
app.use('/api', leadRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', followupRoutes);
app.use('/api', notificationRoutes);
app.use('/api', otpRoutes);
app.use('/api', settingsRoutes);
app.use('/api', studentRoutes);

app.get(['/', '/api'], (req, res) => {
  res.json({
    status: 'OK',
    system: 'GSF Global Scholar Finance Backend API',
    message: 'Welcome to GSF REST API',
    endpoints: {
      health: 'GET /api/health',
      authLogin: 'POST /api/auth/login',
      dashboardStats: 'GET /api/dashboard/stats',
      leads: 'GET /api/leads',
      leadSubmission: 'POST /api/leads',
      otpSend: 'POST /api/otp/send',
      otpVerify: 'POST /api/otp/verify',
      followUps: 'GET /api/follow-ups',
      notifications: 'GET /api/notifications'
    }
  });
});

// Health check endpoint for Railway deployment monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    system: 'GSF Global Scholar Finance API',
    timestamp: new Date().toISOString()
  });
});

initDatabase().then(() => {
  server.listen(PORT, HOST, () => {
    console.log(`=======================================================`);
    console.log(`🚀 GSF Backend API running on http://${HOST}:${PORT}`);
    console.log(`⚡ Real-Time Socket.IO Server active`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
});
