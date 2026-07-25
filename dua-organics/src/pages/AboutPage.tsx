/**
 * Dua Organics — About Page
 * 
 * Brand story, mission, shop locations, and team info.
 */
import { Helmet } from 'react-helmet-async';
import { MapPin, Leaf, Heart, Users, Globe2 } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function AboutPage() {
  const storyAnim = useScrollAnimation();
  const valuesAnim = useScrollAnimation();
  const locAnim = useScrollAnimation();

  return (
    <>
      <Helmet>
        <title>About Us — Dua Organics | Our Story & Mission</title>
        <meta name="description" content="Learn about Dua Organics — our mission to bring premium organic skincare from Kenya's forests to your doorstep. Visit us in Nairobi & Nakuru." />
      </Helmet>

      <main className="pt-24 pb-20 bg-cream-50 min-h-screen">
        {/* Hero Banner */}
        <div className="w-full h-64 md:h-80 bg-forest-900 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7081208/pexels-photo-7081208.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200')] bg-cover bg-center opacity-30" />
          <div className="relative z-10 text-center">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-2 rose-heading">
              Our Story
            </h1>
            <p className="text-white/70 text-lg">Rooted in Nature. Crafted with Love.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Story Section */}
          <section ref={storyAnim.ref} style={storyAnim.style} className="py-16">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
              <h2 className="font-heading text-3xl font-bold text-forest-900 mb-6 floral-heading">Who We Are</h2>
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>
                  <strong className="text-forest-800">Dua Organics</strong> was born from a deep love for Kenya's 
                  natural heritage and a belief that skincare should be pure, honest, and kind — to both people and planet.
                </p>
                <p>
                  We source our ingredients directly from smallholder farmers and forest communities across Kenya. 
                  From the ancient Kakamega Forest to the fertile slopes of Mount Kenya, every ingredient tells a 
                  story of sustainable harvesting, fair trade, and traditional botanical knowledge passed down through generations.
                </p>
                <p>
                  Our products are handcrafted in small batches to ensure the highest quality. We never use 
                  synthetic fragrances, parabens, sulfates, or petroleum derivatives. What you see on our labels 
                  is exactly what's in the bottle — nothing more, nothing less.
                </p>
                <p>
                  The name "Dua" means "prayer" in Swahili — a reflection of our intentional, mindful approach to 
                  everything we create. Every product is a prayer for your wellbeing and the wellbeing of our planet.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section ref={valuesAnim.ref} style={valuesAnim.style} className="pb-16">
            <h2 className="font-heading text-3xl font-bold text-forest-900 mb-8 text-center rose-heading">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Leaf, title: 'Purely Organic', desc: 'Every ingredient is certified organic or wildcrafted from pristine natural environments. No synthetics, ever.' },
                { icon: Heart, title: 'Community First', desc: 'We pay fair trade prices and invest in the communities that nurture our ingredients through education and infrastructure.' },
                { icon: Globe2, title: 'Sustainability', desc: 'From recyclable glass packaging to biodegradable labels, we minimize our environmental footprint at every step.' },
                { icon: Users, title: 'Transparency', desc: 'We believe you deserve to know exactly where your skincare comes from. Ask us anything — we have nothing to hide.' },
              ].map((value, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex gap-4">
                  <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center shrink-0">
                    <value.icon className="w-6 h-6 text-forest-700" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-forest-900 mb-1">{value.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Locations Section */}
          <section ref={locAnim.ref} style={locAnim.style} className="pb-16">
            <h2 className="font-heading text-3xl font-bold text-forest-900 mb-8 text-center floral-heading">Visit Our Shops</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-forest-900 text-white rounded-2xl p-8 text-center">
                <MapPin className="w-10 h-10 text-gold-400 mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-bold mb-2">Nairobi</h3>
                <p className="text-white/80 font-medium">StarMall, Shop C1</p>
                <p className="text-white/50 text-sm mt-2">Mon–Sat: 9:00 AM – 7:00 PM</p>
                <p className="text-white/50 text-sm">Sunday: Closed</p>
                <a
                  href="https://wa.me/254794368339?text=Hi!%20I'd%20like%20to%20visit%20your%20Nairobi%20shop."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors"
                >
                  Get Directions
                </a>
              </div>
              <div className="bg-forest-900 text-white rounded-2xl p-8 text-center">
                <MapPin className="w-10 h-10 text-gold-400 mx-auto mb-4" />
                <h3 className="font-heading text-2xl font-bold mb-2">Nakuru</h3>
                <p className="text-white/80 font-medium">Maasai Market, Stall 27</p>
                <p className="text-white/50 text-sm mt-2">Mon–Sat: 8:00 AM – 6:00 PM</p>
                <p className="text-white/50 text-sm">Sunday: Closed</p>
                <a
                  href="https://wa.me/254794368339?text=Hi!%20I'd%20like%20to%20visit%20your%20Nakuru%20stall."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-gold-500 hover:bg-gold-600 text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
