import {
  Routes,
  Route
} from 'react-router-dom';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Design from './pages/Design';
import Cart from './pages/Cart';
import Listing from './pages/Listing';
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Wishlist from './pages/Wishlist';
import About from './pages/About';

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
    </Routes>
  );
}