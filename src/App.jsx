import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { BusinessSettingsProvider } from './context/BusinessSettingsContext';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { WhatsAppModal } from './components/WhatsAppModal';
import { OfferPopup } from './components/OfferPopup';




// Admin Pages & Layout
import { AuthGuard } from './pages/admin/AuthGuard';
import { AdminLayout } from './pages/admin/AdminLayout';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProductsManager } from './pages/admin/ProductsManager';
import { OffersManager } from './pages/admin/OffersManager';
import { ReviewsManager } from './pages/admin/ReviewsManager';
import { SettingsManager } from './pages/admin/SettingsManager';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { OffersPage } from './pages/OffersPage';
import { ErrorPage } from './pages/ErrorPage';

const PublicLayout = () => {
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
    <>
      <SplashScreen />
      <div className="app-container">
        <Navbar onOpenEnquiry={() => handleOpenEnquiry('General Store Enquiry')} />
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
        <Footer />
        <MobileBottomNav />
        <WhatsAppModal
          isOpen={whatsappModalOpen}
          onClose={handleCloseEnquiry}
          initialProduct={selectedProductForEnquiry}
        />
        <OfferPopup
          onClaimOffer={(product) => handleOpenEnquiry(product)}
        />
      </div>
    </>
  );
};

function App() {
  return (
    <BusinessSettingsProvider>
      <ThemeProvider>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          
          <Route path="/admin" element={<AuthGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductsManager />} />
              <Route path="offers" element={<OffersManager />} />
              <Route path="reviews" element={<ReviewsManager />} />
              <Route path="settings" element={<SettingsManager />} />
            </Route>
          </Route>

          {/* Public Routes (Fallback) */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </ThemeProvider>
    </BusinessSettingsProvider>
  );
}

export default App;
