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
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
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
          
          {/* Protected Client Diagnostic & Audit Engines */}
          <Route 
            path="/security-audit" 
            element={
              <ProtectedRoute toolName="Offensive Security Sandbox">
                <SecurityAuditPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/seo-audit" 
            element={
              <ProtectedRoute toolName="Technical SEO Auditor">
                <SEOAuditPage />
              </ProtectedRoute>
            } 
          />

          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/case-studies/:studyId" element={<CaseStudyDetailPage />} />
          <Route path="/estimator" element={<EstimatorPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* Universal Checkout Hub (Protected: Login Strictly Required to Pay) */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute toolName="Client Checkout & Retainer Portal">
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute toolName="Client Checkout & Retainer Portal">
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay" 
            element={
              <ProtectedRoute toolName="Client Checkout & Retainer Portal">
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/invoice" 
            element={
              <ProtectedRoute toolName="Client Checkout & Retainer Portal">
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Dedicated Individual Payment Pages (Protected) */}
          <Route 
            path="/pay/upi" 
            element={
              <ProtectedRoute toolName="UPI Payment Gateway">
                <UPIPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upi" 
            element={
              <ProtectedRoute toolName="UPI Payment Gateway">
                <UPIPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upi-payment" 
            element={
              <ProtectedRoute toolName="UPI Payment Gateway">
                <UPIPaymentPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/pay/bank" 
            element={
              <ProtectedRoute toolName="Bank Wire Transfer Gateway">
                <BankPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bank" 
            element={
              <ProtectedRoute toolName="Bank Wire Transfer Gateway">
                <BankPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bank-transfer" 
            element={
              <ProtectedRoute toolName="Bank Wire Transfer Gateway">
                <BankPaymentPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/pay/crypto" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crypto" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ethereum" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/ethereum" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/eth" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/eth" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crypto-payment" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/btc" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/btc" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bitcoin" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/bitcoin" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/sol" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sol" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/solana" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/solana" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/tron" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/trx" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/trc20" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tron" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trx" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trc20" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/bnb" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/bsc" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/bep20" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bnb" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bsc" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bep20" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/polygon" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/matic" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pay/pol" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/polygon" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/matic" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pol" 
            element={
              <ProtectedRoute toolName="Cryptocurrency Payment Gateway">
                <CryptoPaymentPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/pay/card" 
            element={
              <ProtectedRoute toolName="Stripe Card Payment Gateway">
                <CardPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/card" 
            element={
              <ProtectedRoute toolName="Stripe Card Payment Gateway">
                <CardPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stripe" 
            element={
              <ProtectedRoute toolName="Stripe Card Payment Gateway">
                <CardPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/card-payment" 
            element={
              <ProtectedRoute toolName="Stripe Card Payment Gateway">
                <CardPaymentPage />
              </ProtectedRoute>
            } 
          />

          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/admin/verify" element={<AdminVerifyPage />} />
          <Route path="/verify" element={<AdminVerifyPage />} />
          {/* Client Authentication Gateway */}
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/signin" element={<AuthPage initialMode="login" />} />
          <Route path="/signup" element={<AuthPage initialMode="signup" />} />
          <Route path="/register" element={<AuthPage initialMode="signup" />} />
          <Route path="/forgot-password" element={<AuthPage initialMode="reset" />} />
          <Route path="/reset-password" element={<AuthPage initialMode="reset" />} />

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
