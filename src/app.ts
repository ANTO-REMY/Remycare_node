import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import motherRoutes from './routes/motherRoutes.js';
import chwRoutes from './routes/chwRoutes.js';
import nurseRoutes from './routes/nurseRoutes.js';
import { sanitizeInput, securityHeaders, checkAccountStatus } from './middleware/security.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(securityHeaders);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes - with account status check for authenticated routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', checkAccountStatus, profileRoutes);
app.use('/api/mother', checkAccountStatus, motherRoutes);
app.use('/api/chw', checkAccountStatus, chwRoutes);
app.use('/api/nurse', checkAccountStatus, nurseRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
