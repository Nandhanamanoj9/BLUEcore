import rateLimit from 'express-rate-limit';

// Standard API rate limiter: 5000 in dev/test, 500 in prod per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 500 : 5000,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Quote submission rate limiter: 10 submissions per 15 minutes
export const quoteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many quote submissions from this IP. Please wait a few minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Contact submission rate limiter: 10 submissions per 15 minutes
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many contact messages from this IP. Please wait a few minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Admin login rate limiter: 100 in development, 5 in production per 15 minutes
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 100,
  message: {
    success: false,
    message: 'Too many failed login attempts. Please wait 15 minutes before retrying.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export default {
  apiLimiter,
  quoteLimiter,
  contactLimiter,
  loginLimiter
};
