import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { WhatsAppModal } from './components/WhatsAppModal';
import { OfferPopup } from './components/OfferPopup';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { OffersPage } from './pages/OffersPage';
import { ErrorPage } from './pages/ErrorPage';

export function App() {
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [selectedProductForEnquiry, setSelectedProductForEnquiry] = useState('');

  const handleOpenEnquiry = (productName = '') => {
    setSelectedProductForEnquiry(productName);
    setWhatsappModalOpen(true);
  };

  const handleCloseEnquiry = () => {
    setWhatsappModalOpen(false);
  };

  return (
    <ThemeProvider>
      {/* 1.5s First Load Animated Splash */}
      <SplashScreen />

      <div className="app-container">
        {/* Sticky Desktop Navbar / Mobile Header */}
        <Navbar onOpenEnquiry={() => handleOpenEnquiry('General Store Enquiry')} />

        {/* Main Routed Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/products" element={<ProductsPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/about" element={<AboutPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/offers" element={<OffersPage onOpenEnquiry={handleOpenEnquiry} />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>

        {/* Footer with verbatim tagline */}
        <Footer />

        {/* Fixed Mobile Bottom Bar (Thumb Zone: Home, Products, Contact, About) */}
        <MobileBottomNav />

        {/* Global Floating WhatsApp Button & In-Site Popup Modal */}
        <WhatsAppModal
          isOpen={whatsappModalOpen}
          onClose={handleCloseEnquiry}
          initialProduct={selectedProductForEnquiry}
        />

        {/* Seasonal Offer Popup (Code-Controlled Switch: SHOW_OFFER_POPUP) */}
        <OfferPopup
          onClaimOffer={(product) => handleOpenEnquiry(product)}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
