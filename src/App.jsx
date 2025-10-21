import React from 'react';
import { useHashRoute } from './hooks/useHashRoute';

// Layout Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { StickyContactBar } from './components/layout/StickyContactBar';

// Page Components
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AreasPage } from './pages/AreasPage';
import { ContactPage } from './pages/ContactPage';

// Data
import { services } from './data/services';

/**
 * Colchester Plumber SPA
 * - Component-based React app using Tailwind classes
 * - Hash-based routing (no external deps)
 * - Pages: Home, Services, Individual Service, About, Reviews, Coverage Areas, Contact
 * - Features: Sticky call/WhatsApp bar, FAQ accordions, Reviews, Map placeholder, Contact form with SendGrid
 */

export default function App() {
  const { route } = useHashRoute();

  // Route matching
  const renderPage = () => {
    if (route === "/" || route === "" || route === "#") {
      return <HomePage />;
    }
    if (route === "/services") {
      return <ServicesPage />;
    }
    if (route.startsWith("/service/")) {
      const slug = route.replace("/service/", "");
      const service = services.find((s) => s.slug === slug);
      if (!service) {
        return <div className="py-20 text-center">Service not found. <a href="#/services" className="text-blue-700">Back to services</a></div>;
      }
      return <ServiceDetailPage service={service} />;
    }
    if (route === "/about") {
      return <AboutPage />;
    }
    if (route === "/reviews") {
      return <ReviewsPage />;
    }
    if (route === "/areas") {
      return <AreasPage />;
    }
    if (route === "/contact") {
      return <ContactPage />;
    }

    // 404 Page
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
        <a href="#/" className="mt-4 inline-block text-blue-700 hover:underline">Go Home</a>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header current={route} />
      <main>
        {renderPage()}
      </main>
      <Footer />
      <StickyContactBar />
    </div>
  );
}