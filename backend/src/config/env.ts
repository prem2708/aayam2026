import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  clerkSecretKey: requireEnv('CLERK_SECRET_KEY'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:3001',
  imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  imagekitUrlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
  ticketBaseUrl: process.env.TICKET_BASE_URL || 'http://localhost:3000/verify',
};
