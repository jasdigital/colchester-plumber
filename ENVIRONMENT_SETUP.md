# Environment Variables Setup for Vercel

## Security Best Practices
- ❌ **NEVER** commit API keys or sensitive data to GitHub
- ✅ **ALWAYS** use Vercel's environment variables dashboard
- ✅ Use `.env.local` for local development only (add to `.gitignore`)

## Required Environment Variables

Set these in your **Vercel Dashboard** → Project Settings → Environment Variables:

### SendGrid Configuration
```
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
```

### Email Configuration
```
BUSINESS_EMAIL=bookings@colchester-plumber.co.uk
FROM_EMAIL=noreply@colchester-plumber.co.uk
```

## How to Set Up in Vercel

1. Go to your Vercel project dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: `SENDGRID_API_KEY`
   - **Value**: Your SendGrid API key (starts with `SG.`)
   - **Environments**: Production, Preview, Development

5. Repeat for `BUSINESS_EMAIL` and `FROM_EMAIL`

## Local Development Setup

For local development with Vite, create a `.env.local` file in your project root (this file is already gitignored):

```env
VITE_SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
VITE_BUSINESS_EMAIL=bookings@colchester-plumber.co.uk
VITE_FROM_EMAIL=noreply@colchester-plumber.co.uk
```

**Note:** Local development uses `VITE_` prefix for environment variables, while production (Vercel) uses the variables without the prefix.

### Quick Setup:
1. Copy `.env.example` to `.env.local`
2. Replace the placeholder values with your actual SendGrid API key
3. Run `npm run dev` to start development server

## Dependencies Installed

The following packages are now installed for email functionality:
- `@sendgrid/mail` - Official SendGrid SDK for sending emails
- `@react-email/components` - React components for building email templates
- `@react-email/render` - Renders React components to HTML for emails

## Getting Your SendGrid API Key

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Go to **Settings** → **API Keys**
3. Create a new API key with **Full Access** or **Mail Send** permissions
4. Copy the key (it starts with `SG.`)
5. Add it to Vercel environment variables

## Testing

After setting up the environment variables:
1. Deploy to Vercel
2. Test the contact form
3. Check Vercel function logs if there are issues

## Security Notes

- The API endpoint uses `process.env.SENDGRID_API_KEY` - this is only available server-side
- Environment variables are never exposed to the client-side code
- Vercel automatically injects these variables into your serverless functions