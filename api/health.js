// Simple health check API for testing Vercel deployment
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    return res.status(200).json({
      status: 'OK',
      message: 'Vercel API is working',
      timestamp: new Date().toISOString(),
      method: req.method,
      environment: {
        hasApiKey: !!process.env.SENDGRID_API_KEY,
        fromEmail: process.env.FROM_EMAIL ? 'Set' : 'Not set',
        businessEmail: process.env.BUSINESS_EMAIL ? 'Set' : 'Not set'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message
    });
  }
}