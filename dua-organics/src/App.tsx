/**
 * Dua Organics — Main App Component
 * 
 * Root component that sets up routing, authentication context,
 * and the global layout (navbar + footer).
 * 
 * Routes:
 *   / — Home page with hero, products, reviews, blog preview
 *   /products — All products with filtering
 *   /products/:slug — Product detail page
 *   /blog — Blog listing
 *   /blog/:slug — Individual blog post
 *   /about — About page with locations
 *   /login — Login / Register
 *   /dashboard — Customer dashboard (protected)
 *   /admin — Admin panel (protected, admin only)
 */
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        {/* Scroll to top on route changes */}
        <ScrollToTop />

        {/* Global Navigation */}
        <Navbar />

        {/* Page Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>

        {/* Global Footer */}
        <Footer />
      </DataProvider>
    </AuthProvider>
  );
}
