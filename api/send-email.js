// SendGrid Mail API for Vercel deployment
export default async function handler(req, res) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Email API called with method:', req.method);
    
    const { name, email, phone, postcode, issue } = req.body || {};

    // Validate required fields
    if (!name || !email || !phone || !issue) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate environment variables
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@colchester-plumber.co.uk';
    const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'bookings@colchester-plumber.co.uk';

    if (!SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Use SendGrid Web API for better Vercel compatibility
    const sendGridRequest = async (emailData) => {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
      }

      return response;
    };

    // Business notification email (SendGrid format)
    const businessEmailData = {
      personalizations: [{
        to: [{ email: BUSINESS_EMAIL }],
        subject: `New Quote Request from ${name}`
      }],
      from: { 
        email: FROM_EMAIL,
        name: 'Colchester Plumber Website'
      },
      reply_to: {
        email: email,
        name: name
      },
      content: [
        {
          type: 'text/html',
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                New Quote Request
              </h2>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Customer Details</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                ${postcode ? `<p><strong>Postcode:</strong> ${postcode}</p>` : ''}
              </div>

              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #92400e; margin-top: 0;">Issue Description</h3>
                <p style="white-space: pre-wrap;">${issue}</p>
              </div>

              <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #065f46; font-size: 14px;">
                  <strong>Submitted:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
                </p>
              </div>
            </div>
          `
        },
        {
          type: 'text/plain',
          value: `New Quote Request

Customer Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
${postcode ? `Postcode: ${postcode}` : ''}

Issue Description:
${issue}

This message was sent from the Colchester Plumber website contact form.
Timestamp: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}`
        }
      ]
    };

    // Send business notification with proper error handling
    await sendGridRequest(businessEmailData);
    console.log('Business notification email sent successfully');

    // Auto-reply to customer (SendGrid format)
    const autoReplyData = {
      personalizations: [{
        to: [{ 
          email: email,
          name: name
        }],
        subject: 'Thank you for your enquiry - Colchester Plumber'
      }],
      from: {
        email: FROM_EMAIL,
        name: 'Colchester Plumbing & Heating Co.'
      },
      content: [
        {
          type: 'text/html',
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">Colchester Plumbing & Heating Co.</h1>
              </div>
              
              <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                <h2 style="color: #1f2937; margin-top: 0;">Thank you for your enquiry, ${name}!</h2>
                
                <p style="color: #374151; line-height: 1.6;">
                  We've received your message and will get back to you as soon as possible, 
                  typically within <strong>1 hour during business hours</strong>.
                </p>

                <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #dc2626; margin-top: 0; font-size: 18px;">For Urgent Issues:</h3>
                  <p style="margin: 5px 0; color: #991b1b;">
                    <strong>📞 Call us now:</strong> <a href="tel:01279249046" style="color: #dc2626;">01279 249046</a>
                  </p>
                  <p style="margin: 5px 0; color: #991b1b;">
                    <strong>💬 WhatsApp:</strong> <a href="https://wa.me/441206123456" style="color: #dc2626;">Message us directly</a>
                  </p>
                </div>

                <p style="color: #374151; line-height: 1.6;">
                  We're looking forward to helping you with your plumbing needs.
                </p>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #6b7280; font-size: 16px;"><strong>Best regards,</strong></p>
                  <p style="margin: 5px 0; color: #1f2937; font-size: 18px; font-weight: bold;">Colchester Plumbing & Heating Co.</p>
                  <p style="margin: 0; color: #059669; font-size: 14px;">Gas Safe Registered • Fully Insured</p>
                </div>
              </div>
            </div>
          `
        },
        {
          type: 'text/plain',
          value: `Thank you for your enquiry, ${name}!

We've received your message and will get back to you as soon as possible, typically within 1 hour during business hours.

For urgent issues:
Call us now: 01279 249046
WhatsApp: https://wa.me/441206123456

We're looking forward to helping you with your plumbing needs.

Best regards,
Colchester Plumbing & Heating Co.
Gas Safe Registered • Fully Insured`
        }
      ]
    };

    // Send auto-reply (don't fail the main request if this fails)
    try {
      await sendGridRequest(autoReplyData);
      console.log('Auto-reply email sent successfully');
    } catch (autoReplyError) {
      console.error('Auto-reply failed:', autoReplyError);
      // Continue without failing the main request - business notification is more important
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Quote request submitted successfully' 
    });

  } catch (error) {
    console.error('Email API Error:', error);
    
    // Return appropriate error response based on error type
    if (error.message && error.message.includes('SendGrid API error')) {
      return res.status(503).json({ 
        error: 'Email service temporarily unavailable',
        message: 'Please try again in a few moments or contact us directly'
      });
    }
    
    if (error.message && error.message.includes('Missing required fields')) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: error.message 
      });
    }
    
    if (error.message && error.message.includes('Email service not configured')) {
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Please contact support'
      });
    }
    
    // Generic error response for any other errors
    return res.status(500).json({ 
      error: 'Failed to process request',
      message: 'An unexpected error occurred. Please try again or contact us directly.'
    });
  }
}