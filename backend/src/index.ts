import app from './app';
import { env } from './config/env';

app.listen(env.port, () => {
  console.log(`🚀 Aayam TechFest API running on http://localhost:${env.port}`);
  console.log(`   Environment: ${env.nodeEnv}`);
});
