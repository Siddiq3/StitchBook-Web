import { Route, Routes } from 'react-router-dom';
import AboutPage from './pages/AboutPage.jsx';
import BillingPage from './pages/BillingPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PaymentResultPage from './pages/PaymentResultPage.jsx';
import UpgradeSessionPage from './pages/UpgradeSessionPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/billing" element={<BillingPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/upgrade/session/:sessionId" element={<UpgradeSessionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/payment-success" element={<PaymentResultPage status="success" />} />
      <Route path="/payment-failure" element={<PaymentResultPage status="failure" />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
