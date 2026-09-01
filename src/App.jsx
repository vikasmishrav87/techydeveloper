import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingDock from './components/FloatingDock';
import InteractiveTerminal from './components/InteractiveTerminal';
import AdminDashboard from './components/AdminDashboard';
import AIChatBot from './components/AIChatBot';
import { useScrollReveal } from './hooks/useScrollReveal';
import { initLocalStorage, logSecurityEvent } from './services/storageService';

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import MarketingPage from './pages/MarketingPage';
import WorldwidePage from './pages/WorldwidePage';
import SecurityAuditPage from './pages/SecurityAuditPage';
import SEOAuditPage from './pages/SEOAuditPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import CaseStudyDetailPage from './pages/CaseStudyDetailPage';
import EstimatorPage from './pages/EstimatorPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';
import UPIPaymentPage from './pages/UPIPaymentPage';
import BankPaymentPage from './pages/BankPaymentPage';
import CryptoPaymentPage from './pages/CryptoPaymentPage';
import CardPaymentPage from './pages/CardPaymentPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AdminVerifyPage from './pages/AdminVerifyPage';
import CookieConsentBanner from './components/CookieConsentBanner';
import Interactive3DScene from './components/Interactive3DScene';
import MagneticCursor from './components/MagneticCursor';

// Scroll to top and log real telemetry on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    logSecurityEvent('PAGE_VIEW', `Visitor Navigated to ${pathname}`, { path: pathname });
  }, [pathname]);

  return null;
}

export default function App() {
  // Initialize bi-directional scroll reveal observer
  useScrollReveal();

  const [terminalOpen, setTerminalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  useEffect(() => {
    initLocalStorage();

    // Keyboard shortcut: ` (backtick) or Ctrl+K for Terminal, Ctrl+/ for AI Assistant
    const handleKeyDown = (e) => {
      if (e.key === '`' || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      } else if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        setAiChatOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScrollTo = (targetId) => {
    const el = document.getElementById(targetId);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-sky-lavender-mesh text-slate-900 selection:bg-sky-500/20 selection:text-sky-900 font-sans antialiased relative">
      
      {/* 3D WebGL Background Scene */}
      <Interactive3DScene />

      {/* Smooth Magnetic Cursor */}
      <MagneticCursor />

      <ScrollToTop />

      {/* Global Navigation Bar */}
      <Navbar
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenAIChat={() => setAiChatOpen(true)}
      />

      {/* Main Website Flow */}
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                onOpenTerminal={() => setTerminalOpen(true)} 
                onOpenAIChat={() => setAiChatOpen(true)} 
              />
            } 
          />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/marketing" element={<MarketingPage />} />
          <Route path="/worldwide" element={<WorldwidePage />} />
          <Route path="/security-audit" element={<SecurityAuditPage />} />
          <Route path="/seo-audit" element={<SEOAuditPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/case-studies/:studyId" element={<CaseStudyDetailPage />} />
          <Route path="/estimator" element={<EstimatorPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* Universal Checkout Hub */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment" element={<CheckoutPage />} />
          <Route path="/pay" element={<CheckoutPage />} />
          <Route path="/invoice" element={<CheckoutPage />} />
          
          {/* Dedicated Individual Payment Pages */}
          <Route path="/pay/upi" element={<UPIPaymentPage />} />
          <Route path="/upi" element={<UPIPaymentPage />} />
          <Route path="/upi-payment" element={<UPIPaymentPage />} />
          
          <Route path="/pay/bank" element={<BankPaymentPage />} />
          <Route path="/bank" element={<BankPaymentPage />} />
          <Route path="/bank-transfer" element={<BankPaymentPage />} />
          
          <Route path="/pay/crypto" element={<CryptoPaymentPage />} />
          <Route path="/crypto" element={<CryptoPaymentPage />} />
          <Route path="/ethereum" element={<CryptoPaymentPage />} />
          <Route path="/pay/ethereum" element={<CryptoPaymentPage />} />
          <Route path="/pay/eth" element={<CryptoPaymentPage />} />
          <Route path="/eth" element={<CryptoPaymentPage />} />
          <Route path="/crypto-payment" element={<CryptoPaymentPage />} />
          <Route path="/pay/btc" element={<CryptoPaymentPage />} />
          <Route path="/btc" element={<CryptoPaymentPage />} />
          <Route path="/bitcoin" element={<CryptoPaymentPage />} />
          <Route path="/pay/bitcoin" element={<CryptoPaymentPage />} />
          <Route path="/pay/sol" element={<CryptoPaymentPage />} />
          <Route path="/sol" element={<CryptoPaymentPage />} />
          <Route path="/solana" element={<CryptoPaymentPage />} />
          <Route path="/pay/solana" element={<CryptoPaymentPage />} />
          <Route path="/pay/tron" element={<CryptoPaymentPage />} />
          <Route path="/pay/trx" element={<CryptoPaymentPage />} />
          <Route path="/pay/trc20" element={<CryptoPaymentPage />} />
          <Route path="/tron" element={<CryptoPaymentPage />} />
          <Route path="/trx" element={<CryptoPaymentPage />} />
          <Route path="/trc20" element={<CryptoPaymentPage />} />
          <Route path="/pay/bnb" element={<CryptoPaymentPage />} />
          <Route path="/pay/bsc" element={<CryptoPaymentPage />} />
          <Route path="/pay/bep20" element={<CryptoPaymentPage />} />
          <Route path="/bnb" element={<CryptoPaymentPage />} />
          <Route path="/bsc" element={<CryptoPaymentPage />} />
          <Route path="/bep20" element={<CryptoPaymentPage />} />
          <Route path="/pay/polygon" element={<CryptoPaymentPage />} />
          <Route path="/pay/matic" element={<CryptoPaymentPage />} />
          <Route path="/pay/pol" element={<CryptoPaymentPage />} />
          <Route path="/polygon" element={<CryptoPaymentPage />} />
          <Route path="/matic" element={<CryptoPaymentPage />} />
          <Route path="/pol" element={<CryptoPaymentPage />} />
          
          <Route path="/pay/card" element={<CardPaymentPage />} />
          <Route path="/card" element={<CardPaymentPage />} />
          <Route path="/stripe" element={<CardPaymentPage />} />
          <Route path="/card-payment" element={<CardPaymentPage />} />

          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/admin/verify" element={<AdminVerifyPage />} />
          <Route path="/verify" element={<AdminVerifyPage />} />
          <Route path="/verify-payments" element={<AdminVerifyPage />} />
          {/* Catch-all fallback so no URL ever shows a blank page */}
          <Route path="*" element={<Navigate to="/checkout" replace />} />
        </Routes>
      </main>

      {/* Global GDPR/CCPA Cookie Consent & Privacy Compliance Banner */}
      <CookieConsentBanner />

      {/* Footer & Global Sitemap */}
      <Footer
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Persistent Floating Contact & AI Dock (Bottom-Right) */}
      <FloatingDock
        onOpenTerminal={() => setTerminalOpen(true)}
        onOpenEstimator={() => handleScrollTo('estimator')}
        onOpenScanner={() => handleScrollTo('scanner')}
        onOpenAIChat={() => setAiChatOpen(true)}
      />

      {/* Global AI ChatBot (Powered by GPT-4o) */}
      <AIChatBot
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
      />

      {/* Interactive CLI Engineer Terminal Modal */}
      <InteractiveTerminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Executive Admin Oversight Dashboard */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

    </div>
  );
}
