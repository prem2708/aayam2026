import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { sendError } from './utils/errors';
import { publicLimiter } from './middleware/rateLimit';

import authRoutes from './routes/auth.routes';
import adminAuthRoutes from './routes/adminAuth.routes';
import eventsRoutes from './routes/events.routes';
import registrationsRoutes from './routes/registrations.routes';
import adminRoutes from './routes/admin.routes';
import imagekitRoutes from './routes/imagekit.routes';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [env.frontendUrl, env.adminUrl],
    credentials: true,
  })
);
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(publicLimiter);

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'aayamtechfest-api' } });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin/auth', adminAuthRoutes);
app.use('/api/v1/events', eventsRoutes);
app.use('/api/v1/registrations', registrationsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/imagekit', imagekitRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: { message: 'Route not found' } });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  sendError(res, err);
});

export default app;
