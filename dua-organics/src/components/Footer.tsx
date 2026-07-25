/**
 * Dua Organics — Footer Component
 * 
 * Includes shop locations, contact info, social links,
 * newsletter signup, and sitemap links.
 */
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Leaf, Clock, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-white" role="contentinfo">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-forest-300" />
              <span className="font-heading text-2xl font-bold">Dua Organics</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Premium organic skincare crafted from nature's finest botanicals. 
              Every product tells a story of sustainability, community, and pure natural beauty.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center hover:bg-gold-500 transition-colors" aria-label="Instagram">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center hover:bg-gold-500 transition-colors" aria-label="Facebook">
                <Heart className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/254794368339"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center hover:bg-gold-500 transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-forest-300">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/products', label: 'Shop All Products' },
                { to: '/blog', label: 'Blog & Wellness' },
                { to: '/about', label: 'Our Story' },
                { to: '/login', label: 'My Account' },
                { to: '/dashboard', label: 'Order History' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-white/70 hover:text-gold-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Locations */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-forest-300">Our Shops</h3>
            <div className="space-y-4">
              {/* Nairobi Location */}
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Nairobi</p>
                  <p className="text-white/70 text-sm">StarMall, Shop C1</p>
                  <div className="flex items-center gap-1 text-white/50 text-xs mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Mon-Sat: 9AM - 7PM</span>
                  </div>
                </div>
              </div>
              {/* Nakuru Location */}
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Nakuru</p>
                  <p className="text-white/70 text-sm">Maasai Market, Stall 27</p>
                  <div className="flex items-center gap-1 text-white/50 text-xs mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Mon-Sat: 8AM - 6PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-forest-300">Contact Us</h3>
            <div className="space-y-3 mb-6">
              <a href="tel:+254794368339" className="flex items-center gap-2 text-white/70 hover:text-gold-400 text-sm transition-colors">
                <Phone className="w-4 h-4" />
                +254 794 368 339
              </a>
              <a href="mailto:hello@duaorganics.com" className="flex items-center gap-2 text-white/70 hover:text-gold-400 text-sm transition-colors">
                <Mail className="w-4 h-4" />
                hello@duaorganics.com
              </a>
            </div>
            <h4 className="font-semibold text-sm mb-2">Join Our Newsletter</h4>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-forest-800 border border-forest-600 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-forest-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} Dua Organics. All rights reserved. Crafted with 🌿 in Kenya.
          </p>
          <div className="flex gap-4 text-white/50 text-xs">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
