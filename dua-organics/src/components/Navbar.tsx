/**
 * Dua Organics — Navigation Bar
 *
 * Brand on the left, hamburger menu on the right (all screen sizes).
 * The hamburger opens a slide-out drawer with every section of the site.
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ShoppingBag, Phone, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WHATSAPP_ORDER =
  'https://wa.me/254794368339?text=Hi%20Dua%20Organics!%20I\'d%20like%20to%20place%20an%20order.';

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

  /* Close menu on route change */
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  /* Close on Escape + lock page scroll while the menu is open */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  /* Transparent navbar over the hero on the homepage */
  const isHome = location.pathname === '/';
  const bgClass = scrolled || !isHome
    ? 'bg-forest-900/95 backdrop-blur-md shadow-lg'
    : 'bg-transparent';

  const mainLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop All Products' },
    { to: '/products?category=Hair%20Care', label: 'Hair Care' },
    { to: '/products?category=Body%20Care', label: 'Body Care' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About Us' },
  ];

  const linkClass =
    'block text-white/90 hover:text-gold-400 py-3 text-lg font-medium tracking-wide border-b border-white/10 transition-colors';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center group" aria-label="Dua Organics — Home">
              <span className="bg-cream-50/95 rounded-xl px-2 py-1 shadow-md group-hover:shadow-lg transition-shadow">
                <img
                  src="/logo.png"
                  alt="Dua Organics — Natural Beauty, Naturally you"
                  className="h-10 md:h-12 w-auto block"
                />
              </span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Order CTA (desktop) */}
              <a
                href={WHATSAPP_ORDER}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4" />
                Order Now
              </a>

              {/* Hamburger — visible on every screen size */}
              <button
                onClick={() => setIsOpen(true)}
                className="text-white p-2 hover:text-gold-400 transition-colors"
                aria-label="Open menu"
                aria-expanded={isOpen}
                aria-controls="site-menu"
              >
                <Menu className="w-7 h-7" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.7))' }} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Slide-out menu */}
      <aside
        id="site-menu"
        className={`fixed top-0 right-0 bottom-0 z-[70] w-80 max-w-[85vw] bg-forest-900 text-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Site menu"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between px-6 h-16 md:h-20 border-b border-white/10">
          <span className="font-heading text-2xl font-bold">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:text-gold-400 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="px-6 py-4">
          {mainLinks.map(link => (
            <Link key={link.label} to={link.to} className={linkClass}>
              {link.label}
            </Link>
          ))}

          {/* Account */}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={linkClass}>
                <span className="flex items-center gap-2"><User className="w-5 h-5" /> My Dashboard</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className={`${linkClass} text-forest-300`}>
                  Admin Panel
                </Link>
              )}
            </>
          ) : (
            <Link to="/login" className={linkClass}>
              <span className="flex items-center gap-2"><User className="w-5 h-5" /> Login / Register</span>
            </Link>
          )}

          <a
            href={WHATSAPP_ORDER}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white text-center px-4 py-3 rounded-full font-semibold mt-6 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Order on WhatsApp
          </a>

          {/* Quick contact */}
          <div className="mt-8 space-y-3 text-sm text-white/70">
            <a href="tel:+254794368339" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
              <Phone className="w-4 h-4" /> +254 794 368 339
            </a>
            <a href="mailto:duaorganics@gmail.com" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
              <Mail className="w-4 h-4" /> duaorganics@gmail.com
            </a>
            <Link to="/about" className="flex items-center gap-2 hover:text-gold-400 transition-colors">
              <MapPin className="w-4 h-4" /> Nairobi · Nakuru · Eldoret
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
