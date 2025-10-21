const sgMail = require('@sendgrid/mail');
const { render } = require('@react-email/render');
const { QuoteRequestEmail } = require('../emails/QuoteRequestEmail.jsx');
const { AutoReplyEmail } = require('../emails/AutoReplyEmail.jsx');

// Set up SendGrid - handle both dev (VITE_) and production env vars
const apiKey = process.env.SENDGRID_API_KEY || process.env.VITE_SENDGRID_API_KEY;
sgMail.setApiKey(apiKey);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, postcode, issue } = req.body;

    // Basic validation
    if (!name || !email || !phone || !issue) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, phone, and issue are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create email content using React Email template
    const emailHtml = render(QuoteRequestEmail({ name, email, phone, postcode, issue }));
    
    const emailData = {
      to: process.env.BUSINESS_EMAIL || process.env.VITE_BUSINESS_EMAIL || 'bookings@colchester-plumber.co.uk',
      from: {
        email: process.env.FROM_EMAIL || process.env.VITE_FROM_EMAIL || 'noreply@colchester-plumber.co.uk',
        name: 'Colchester Plumber Website'
      },
      replyTo: email,
      subject: `New Quote Request from ${name}`,
      html: emailHtml,
      text: `
New Quote Request

Customer Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
${postcode ? `Postcode: ${postcode}` : ''}

Issue Description:
${issue}

This message was sent from the Colchester Plumber website contact form.
Timestamp: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
      `
    };

    // Send email using SendGrid
    await sgMail.send(emailData);

    // Send auto-reply to customer using React Email template
    const autoReplyHtml = render(AutoReplyEmail({ name }));
    
    const autoReplyData = {
      to: email,
      from: {
        email: process.env.FROM_EMAIL || process.env.VITE_FROM_EMAIL || 'noreply@colchester-plumber.co.uk',
        name: 'Colchester Plumbing & Heating Co.'
      },
      subject: 'Thank you for your enquiry - Colchester Plumber',
      html: autoReplyHtml,
      text: `
Thank you for your enquiry, ${name}!

We've received your message and will get back to you as soon as possible, typically within 1 hour during business hours.

For urgent issues:
Call us now: 01279 249046
WhatsApp: https://wa.me/441206123456

We're looking forward to helping you with your plumbing needs.

Best regards,
Colchester Plumbing & Heating Co.
Gas Safe Registered • Fully Insured
      `
    };

    await sgMail.send(autoReplyData);

    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('SendGrid Error:', error);
    
    // Handle SendGrid specific errors
    if (error.response) {
      console.error('SendGrid Response:', error.response.body);
    }

    return res.status(500).json({ 
      error: 'Failed to send email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}