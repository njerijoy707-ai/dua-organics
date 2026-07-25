/**
 * Dua Organics — Blog List Page
 *
 * Displays all blog posts in a grid layout.
 * SEO: meta tags, article schema.
 * Animations use inline transition styles.
 */
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';
import type { BlogPost } from '../data/blog';
import { useData } from '../context/DataContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function BlogListPage() {
  const { blogPosts } = useData();
  const headerAnim = useScrollAnimation();

  return (
    <>
      <Helmet>
        <title>Blog — Wellness & Organic Skincare Tips | Dua Organics</title>
        <meta name="description" content="Read our blog for organic skincare tips, wellness rituals, and stories about sustainable ingredient sourcing from Kenya's forests." />
        <meta property="og:title" content="Blog — Dua Organics" />
        <meta property="og:description" content="Wellness tips, skincare science, and stories from nature." />
      </Helmet>

      <main className="pt-24 pb-20 bg-cream-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div ref={headerAnim.ref} style={headerAnim.style} className="text-center mb-14">
            <span className="text-forest-500 text-sm font-semibold uppercase tracking-widest">Our Journal</span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-forest-900 mt-2 rose-heading">
              Wellness & Wisdom
            </h1>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="w-12 h-px bg-forest-300 inline-block" />
              <Leaf className="w-5 h-5 text-forest-400" />
              <span className="w-12 h-px bg-forest-300 inline-block" />
            </div>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              Explore the world of organic skincare, sustainable living, and natural wellness.
            </p>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <BlogCardAnimated key={post.id} post={post} index={i} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

/* Animated blog card with scroll-triggered fade-in */
function BlogCardAnimated({ post, index }: { post: BlogPost; index: number }) {
  const { ref, style } = useScrollAnimation({ delay: index * 150 });

  return (
    <article
      ref={ref}
      style={style}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500"
    >
      {/* Blog Image */}
      <div className="overflow-hidden aspect-video">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
      </div>

      {/* Blog Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-forest-600 bg-forest-100 px-2.5 py-0.5 rounded-full font-medium">
            {post.category}
          </span>
          <span className="text-xs text-gray-400">{post.readTime}</span>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h2 className="font-heading text-xl font-semibold text-forest-900 hover:text-gold-600 transition-colors mb-2 line-clamp-2">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-500 text-sm line-clamp-3 mb-4">{post.excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{post.authorAvatar}</span>
            <div>
              <p className="text-xs font-semibold text-forest-800">{post.author}</p>
              <p className="text-xs text-gray-400">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <Link
            to={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-forest-700 hover:text-gold-600 text-sm font-semibold transition-colors group/link"
          >
            Read
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
