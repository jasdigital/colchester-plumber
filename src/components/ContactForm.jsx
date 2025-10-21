import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    issue: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const { name, email, phone, postcode, issue } = formData;

      // Validate required fields
      if (!name || !email || !phone || !issue) {
        setStatus({
          type: 'error',
          message: 'Please fill in all required fields.'
        });
        setIsSubmitting(false);
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setStatus({
          type: 'error',
          message: 'Please enter a valid email address.'
        });
        setIsSubmitting(false);
        return;
      }

      // Send email via API endpoint
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          postcode,
          issue
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`);
      }

      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. We\'ll get back to you within 1 hour during business hours.'
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        postcode: '',
        issue: ''
      });

    } catch (error) {
      console.error('SendGrid error:', error);
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or call us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Your Free Quote</h2>
          <p className="text-gray-600">Fill out the form below and we'll get back to you within 1 hour</p>
        </div>

        {status.message && (
          <div className={`p-4 rounded-lg ${
            status.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {status.message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="01206 123456"
            />
          </div>

          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2">
              Postcode
            </label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="CO1 1AA"
            />
          </div>
        </div>

        <div>
          <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-2">
            Describe Your Plumbing Issue *
          </label>
          <textarea
            id="issue"
            name="issue"
            required
            rows={5}
            value={formData.issue}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
            placeholder="Please describe your plumbing issue in as much detail as possible. Include location, symptoms, and any relevant information that will help us provide an accurate quote."
          />
        </div>

        <div className="text-center">
          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="w-full md:w-auto min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              'Get Free Quote'
            )}
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>We respect your privacy. Your information will only be used to provide you with a quote.</p>
        </div>
      </form>
    </Card>
  );
}