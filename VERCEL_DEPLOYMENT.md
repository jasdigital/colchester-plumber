# Vercel Deployment Guide

## Fixed Issues

The "Page not found" error was caused by incorrect API route configuration for Vercel. Here's what was fixed:

### 1. Project Structure
- **Before**: API routes were in `pages/api/` (Next.js style)
- **After**: API routes are in `api/` (Vercel standard for SPA + API)

### 2. Vercel Configuration
Created `vercel.json` to properly handle:
- Static SPA serving from `dist/` folder
- API routes as serverless functions
- Proper routing between SPA and API

### 3. API Route Location
- **File**: `/api/send-email.js`
- **Endpoint**: `https://yourdomain.vercel.app/api/send-email`
- **Method**: POST

## Deployment Steps

### 1. Environment Variables
Set these in your Vercel dashboard:

```bash
SENDGRID_API_KEY=SG.your_actual_sendgrid_api_key_here
FROM_EMAIL=noreply@colchester-plumber.co.uk
BUSINESS_EMAIL=bookings@colchester-plumber.co.uk
```

### 2. Build Configuration
Vercel will automatically:
- Run `npm run build` (builds Vite app to `dist/`)
- Deploy API functions from `api/` directory
- Serve SPA with proper fallback routing

### 3. Verification
After deployment, test:
- **Website**: `https://yourdomain.vercel.app/`
- **API**: `https://yourdomain.vercel.app/api/send-email`

## Project Structure

```
├── api/
│   └── send-email.js          # Vercel serverless function
├── dist/                      # Vite build output (auto-generated)
├── src/                       # React SPA source
├── pages/                     # Old API location (can be removed)
├── vercel.json               # Vercel configuration
└── package.json
```

## Notes

- The contact form sends POST requests to `/api/send-email`
- Vercel automatically handles routing
- CORS headers are configured in the API function
- Environment variables are injected at build time