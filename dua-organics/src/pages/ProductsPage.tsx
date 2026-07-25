/**
 * Dua Organics — Products Page
 * 
 * Displays all products with category filtering.
 * SEO: meta tags, semantic HTML, product schema.
 */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Leaf } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useData } from '../context/DataContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function ProductsPage() {
  const { products, loading } = useData();
  const [activeCategory, setActiveCategory] = useState('All');
  const headerAnim = useScrollAnimation();

  /* Extract unique categories from products */
  const categories = ['All', ...new Set(products.map(p => p.category))];

  /* Filter products by selected category */
  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <>
      <Helmet>
        <title>Shop Organic Products | Dua Organics</title>
        <meta name="description" content="Browse our collection of premium organic skincare products. Face serums, body butters, herbal teas, essential oils & lip balms — all handcrafted in Kenya." />
        <meta property="og:title" content="Shop Organic Products | Dua Organics" />
        <meta property="og:description" content="Browse premium organic skincare products crafted from nature's finest botanicals." />
      </Helmet>

      <main className="pt-24 pb-20 bg-cream-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div ref={headerAnim.ref} style={headerAnim.style} className="text-center mb-12">
            <span className="text-forest-500 text-sm font-semibold uppercase tracking-widest">Our Collection</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest-900 mt-2 rose-heading">
              Shop All Products
            </h1>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="w-12 h-px bg-forest-300" />
              <Leaf className="w-5 h-5 text-forest-400" />
              <span className="w-12 h-px bg-forest-300" />
            </div>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              Handcrafted with love using sustainably sourced organic ingredients from Kenya's forests and highlands.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-forest-700 text-white shadow-md'
                    : 'bg-white text-forest-700 hover:bg-forest-100 border border-forest-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {/* Empty / Loading State */}
          {loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">Loading products…</p>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
