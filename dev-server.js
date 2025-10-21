import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Email API endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, postcode, issue } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !issue) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Configure SendGrid SMTP
    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    if (!SENDGRID_API_KEY) {
      console.log('SendGrid API key not configured - simulating email send');
      console.log('Form data:', { name, email, phone, postcode, issue });
      
      return res.json({ 
        success: true, 
        message: 'Development mode: Email simulated successfully',
        data: { name, email, phone, postcode, issue }
      });
    }

    const transporter = nodemailer.createTransporter({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: {
        user: 'apikey',
        pass: SENDGRID_API_KEY,
      },
    });

    // Business notification email
    const businessEmail = {
      from: `"Colchester Plumber Website" <${process.env.FROM_EMAIL || 'noreply@colchester-plumber.co.uk'}>`,
      to: process.env.BUSINESS_EMAIL || 'bookings@colchester-plumber.co.uk',
      replyTo: `"${name}" <${email}>`,
      subject: `New Quote Request from ${name}`,
      html: `
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
      `,
      text: `New Quote Request

Customer Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
${postcode ? `Postcode: ${postcode}` : ''}

Issue Description:
${issue}

This message was sent from the Colchester Plumber website contact form.
Timestamp: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}`
    };

    // Send business notification
    await transporter.sendMail(businessEmail);

    // Auto-reply to customer
    const autoReply = {
      from: `"Colchester Plumbing & Heating Co." <${process.env.FROM_EMAIL || 'noreply@colchester-plumber.co.uk'}>`,
      to: `"${name}" <${email}>`,
      subject: 'Thank you for your enquiry - Colchester Plumber',
      html: `
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
      `,
      text: `Thank you for your enquiry, ${name}!

We've received your message and will get back to you as soon as possible, typically within 1 hour during business hours.

For urgent issues:
Call us now: 01279 249046
WhatsApp: https://wa.me/441206123456

We're looking forward to helping you with your plumbing needs.

Best regards,
Colchester Plumbing & Heating Co.
Gas Safe Registered • Fully Insured`
    };

    // Send auto-reply (don't fail if this fails)
    try {
      await transporter.sendMail(autoReply);
    } catch (autoReplyError) {
      console.error('Auto-reply failed:', autoReplyError);
    }

    res.json({ 
      success: true, 
      message: 'Emails sent successfully' 
    });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Development API server running' });
});

app.listen(PORT, () => {
  console.log(`Development API server running on http://localhost:${PORT}`);
  console.log(`Email endpoint available at http://localhost:${PORT}/api/send-email`);
});