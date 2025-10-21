// Simple test for the email API
// Run with: node test-email.js

const fetch = require('node-fetch');

const testEmailAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '01206 123456',
        postcode: 'CO1 1AA',
        issue: 'This is a test email from the development environment.'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Email API test successful:', result);
    } else {
      console.error('❌ Email API test failed:', result);
    }
  } catch (error) {
    console.error('❌ Email API test error:', error.message);
  }
};

// Only run if this file is executed directly
if (require.main === module) {
  testEmailAPI();
}

module.exports = { testEmailAPI };