import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Link,
  Hr,
} from '@react-email/components';

export function AutoReplyEmail({ name }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank you for your enquiry, {name}!</Heading>
          
          <Text style={text}>
            We've received your message and will get back to you as soon as possible, 
            typically within 1 hour during business hours.
          </Text>
          
          <Section style={urgentSection}>
            <Heading style={h2}>For urgent issues:</Heading>
            <Text style={text}>
              <strong>Call us now:</strong> <Link href="tel:01279249046" style={link}>01279 249046</Link>
            </Text>
            <Text style={text}>
              <strong>WhatsApp:</strong> <Link href="https://wa.me/441206123456" style={link}>Message us</Link>
            </Text>
          </Section>

          <Text style={text}>
            We're looking forward to helping you with your plumbing needs.
          </Text>
          
          <Hr style={hr} />
          
          <Section style={signature}>
            <Text style={text}>
              Best regards,<br />
              <strong>Colchester Plumbing & Heating Co.</strong><br />
              Gas Safe Registered • Fully Insured
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1e40af',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 30px',
  padding: '0',
};

const h2 = {
  color: '#1e40af',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
  padding: '0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const urgentSection = {
  backgroundColor: '#dbeafe',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const link = {
  color: '#1e40af',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};

const signature = {
  marginTop: '20px',
};