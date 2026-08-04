/**
 * Dua Organics — Hero Section
 *
 * Fullscreen looping video background of a dense forest with a stream.
 * Dark green, no overlay, with elegant Times New Roman brand name.
 * CTA buttons redirect checkout to WhatsApp.
 *
 * Animations use inline CSS keyframes via state so they
 * never get purged by Tailwind.
 */
import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown } from 'lucide-react';

/* Video source: uploaded local video */
const VIDEO_URL = '/hero-video.mp4';

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);

  /* Trigger entrance animations once the component mounts */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* Smooth scroll to products section */
  const scrollToProducts = () => {
    const el = document.getElementById('products');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  /* WhatsApp CTA link */
  const whatsappUrl = 'https://wa.me/254794368339?text=Hi%20Dua%20Organics!%20I%27d%20like%20to%20browse%20your%20products%20and%20place%20an%20order.';

  /* Helper to build staggered fade-in style */
  const fadeStyle = (delay: number): React.CSSProperties => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.9s ease-out ${delay}s, transform 0.9s ease-out ${delay}s`,
  });

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      aria-label="Hero section"
    >
      {/* Fullscreen Looping Video Background — no overlay */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      {/* Subtle gradient at bottom for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-900/20 to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Decorative logo icon */}
        <div style={fadeStyle(0)} className="mb-4">
          <img
            src="/favicon.png"
            alt=""
            aria-hidden="true"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
          />
        </div>

        {/* Brand Name — Elegant Times New Roman / Cormorant Garamond, in brand colors */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wide mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
            textShadow: '0 2px 16px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.4)',
            ...fadeStyle(0.15),
          }}
        >
          <span style={{ color: '#8EB115' }}>Dua</span>{' '}
          <span style={{ color: '#603B1E' }}>Organics</span>
        </h1>

        {/* Tagline */}
        <p
          className="text-lg sm:text-xl md:text-2xl font-light max-w-2xl mb-2 italic"
          style={{
            fontFamily: 'var(--font-body)',
            color: '#8FCC8F',
            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
            ...fadeStyle(0.3),
          }}
        >
          Natural Beauty, Naturally You
        </p>

        {/* Leaf divider */}
        <div className="flex items-center gap-3 mb-8" style={fadeStyle(0.45)}>
          <span className="w-16 h-px bg-gold-400/60 inline-block" />
          <span className="text-gold-400 text-lg">🌹</span>
          <span className="w-16 h-px bg-gold-400/60 inline-block" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4" style={fadeStyle(0.6)}>
          {/* Primary CTA — WhatsApp Order */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-gold-500/30"
          >
            <ShoppingBag className="w-5 h-5 group-hover:animate-bounce" />
            Shop Now on WhatsApp
          </a>

          {/* Secondary CTA — Explore Products */}
          <button
            onClick={scrollToProducts}
            className="flex items-center justify-center gap-2 border-2 border-white/40 hover:border-gold-400 text-white hover:text-gold-400 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Explore Products
          </button>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToProducts}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-gold-400 transition-colors animate-bounce"
          aria-label="Scroll down"
          style={fadeStyle(0.8)}
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
    </section>
  );
}
