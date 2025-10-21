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

export function QuoteRequestEmail({ name, email, phone, postcode, issue }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Quote Request</Heading>
          
          <Section style={customerSection}>
            <Heading style={h2}>Customer Details</Heading>
            <Text style={text}>
              <strong>Name:</strong> {name}
            </Text>
            <Text style={text}>
              <strong>Email:</strong> <Link href={`mailto:${email}`} style={link}>{email}</Link>
            </Text>
            <Text style={text}>
              <strong>Phone:</strong> <Link href={`tel:${phone}`} style={link}>{phone}</Link>
            </Text>
            {postcode && (
              <Text style={text}>
                <strong>Postcode:</strong> {postcode}
              </Text>
            )}
          </Section>

          <Section style={issueSection}>
            <Heading style={h2}>Issue Description</Heading>
            <Text style={issueText}>{issue}</Text>
          </Section>

          <Hr style={hr} />
          
          <Section style={footer}>
            <Text style={footerText}>
              This message was sent from the Colchester Plumber website contact form.
            </Text>
            <Text style={footerText}>
              Timestamp: {new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
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
  margin: '40px 0',
  padding: '0',
  borderBottom: '2px solid #1e40af',
  paddingBottom: '10px',
};

const h2 = {
  color: '#374151',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
  padding: '0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '8px 0',
};

const issueText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  whiteSpace: 'pre-wrap',
  padding: '20px',
  backgroundColor: '#fefefe',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
};

const customerSection = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const issueSection = {
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

const footer = {
  marginTop: '20px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '4px 0',
};