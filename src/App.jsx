import {
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Design from './pages/Design';
import Cart from './pages/Cart';
import Listing from './pages/Listing';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import AppRedirect from './pages/AppRedirect';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalog/:id" element={<Catalog />} />
      <Route path="/design/:id" element={<Design />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/listing" element={<Listing />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/about" element={<About />} />
      <Route path="/app" element={<AppRedirect />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}