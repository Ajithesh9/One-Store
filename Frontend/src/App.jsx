import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Contexts
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import DownloadModal from './components/DownloadModal';
import { BackToTopButton } from './components/BackToTopButton';

const MainLayout = ({ onDownloadClick }) => (
  <>
    <Hero onDownloadClick={onDownloadClick} />
    <Features />
    <HowItWorks />
    <Pricing />
    <FAQ />
  </>
);

function App() {
  const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
  const lenisRef = useRef(null);
  const location = useLocation();

  const openDownloadModal = () => setDownloadModalOpen(true);
  const closeDownloadModal = () => setDownloadModalOpen(false);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenisRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      isDownloadModalOpen ? lenisRef.current.stop() : lenisRef.current.start();
    }
  }, [isDownloadModalOpen]);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="bg-dark-background min-h-screen text-dark-onSurface">
          <Navbar onDownloadClick={openDownloadModal} />

          <main>
            <Routes>
              <Route path="/" element={<MainLayout onDownloadClick={openDownloadModal} />} />
              <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          <Footer />

          <AnimatePresence>
            {isDownloadModalOpen && <DownloadModal onClose={closeDownloadModal} />}
          </AnimatePresence>

          <BackToTopButton />
          <SpeedInsights />
          <Analytics />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export const scrollToElement = (selector, offset = 0) => {
  const element = document.querySelector(selector);
  if (element) {
    if (window.lenis) {
      window.lenis.scrollTo(element, { offset });
    } else {
      const y = element.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
};

export const scrollToTop = () => {
  if (window.lenis) {
    window.lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export default App;