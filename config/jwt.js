import crypto from 'crypto';

const configuredSecret = process.env.JWT_SECRET?.trim();
if (process.env.NODE_ENV === 'production' && !configuredSecret) {
    throw new Error('JWT_SECRET must be set in production.');
}

export const JWT_SECRET = configuredSecret || crypto.randomBytes(32).toString('hex');
