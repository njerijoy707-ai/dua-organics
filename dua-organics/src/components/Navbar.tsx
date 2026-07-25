/**
 * Dua Organics — Navigation Bar
 * 
 * Responsive navigation with transparent-to-solid scroll effect.
 * Includes mobile hamburger menu and auth-aware links.
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ShoppingBag, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  /* Track scroll position for navbar background */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  /* Determine if we're on the homepage for transparent navbar */
  const isHome = location.pathname === '/';
  const bgClass = scrolled || !isHome
    ? 'bg-forest-900/95 backdrop-blur-md shadow-lg'
    : 'bg-transparent';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Leaf className="w-6 h-6 text-forest-300 group-hover:text-gold-400 transition-colors" />
            <span className="font-heading text-2xl md:text-3xl font-bold text-white tracking-wide">
              Dua Organics
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-wider uppercase transition-colors duration-300 ${
                  location.pathname === link.to
                    ? 'text-gold-400 border-b-2 border-gold-400 pb-1'
                    : 'text-white/90 hover:text-gold-400'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth Links */}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium tracking-wider uppercase text-forest-300 hover:text-gold-400 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-gold-400 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-sm font-medium text-white/90 hover:text-gold-400 transition-colors"
              >
                <User className="w-4 h-4" />
                Login
              </Link>
            )}

            {/* CTA — Order on WhatsApp */}
            <a
              href="https://wa.me/254794368339?text=Hi%20Dua%20Organics!%20I'd%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              Order Now
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-forest-900/98 backdrop-blur-md border-t border-forest-700">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block text-white/90 hover:text-gold-400 py-2 font-medium tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="block text-forest-300 hover:text-gold-400 py-2 font-medium">
                    Admin Panel
                  </Link>
                )}
                <Link to="/dashboard" className="block text-white/90 hover:text-gold-400 py-2 font-medium">
                  Dashboard
                </Link>
              </>
            ) : (
              <Link to="/login" className="block text-white/90 hover:text-gold-400 py-2 font-medium">
                Login / Register
              </Link>
            )}
            <a
              href="https://wa.me/254794368339?text=Hi%20Dua%20Organics!%20I'd%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gold-500 text-white text-center px-4 py-3 rounded-full font-semibold mt-2"
            >
              🛒 Order on WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
