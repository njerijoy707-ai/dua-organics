/**
 * Dua Organics — Blog Post Detail Page
 * 
 * Full blog post with slug routing, rich snippets schema,
 * and responsive typography.
 */
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getBlogBySlug, blogPosts } = useData();
  const post = getBlogBySlug(slug || '');

  /* 404 — Blog post not found */
  if (!post) {
    return (
      <main className="pt-24 pb-20 min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-forest-900 mb-4">Post Not Found</h1>
          <p className="text-gray-500 mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="text-forest-700 hover:text-gold-600 font-semibold">← Back to Blog</Link>
        </div>
      </main>
    );
  }

  /* Other posts for "Read More" section */
  const otherPosts = blogPosts.filter(p => p.id !== post.id);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
      </Helmet>

      {/* Article Schema for Rich Snippets */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.image,
        "datePublished": post.date,
        "author": {
          "@type": "Organization",
          "name": post.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Dua Organics",
          "logo": { "@type": "ImageObject", "url": "https://duaorganics.com/logo.png" }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://duaorganics.com/blog/${post.slug}`
        }
      })}} />

      <main className="pt-24 pb-20 bg-cream-50 min-h-screen">
        {/* Hero Image */}
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          {/* Article Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            {/* Back Link */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-forest-600 hover:text-gold-600 text-sm font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs text-forest-600 bg-forest-100 px-3 py-1 rounded-full font-semibold">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {post.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-forest-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-forest-100">
              <span className="text-2xl">{post.authorAvatar}</span>
              <div>
                <p className="font-semibold text-forest-800">{post.author}</p>
                <p className="text-xs text-gray-400">Published on {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Article Content — rendered as styled prose */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed
              [&>h2]:font-heading [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:font-bold [&>h2]:text-forest-900 [&>h2]:mt-10 [&>h2]:mb-4
              [&>h3]:font-heading [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:font-semibold [&>h3]:text-forest-800 [&>h3]:mt-8 [&>h3]:mb-3
              [&>h4]:font-heading [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:text-forest-700 [&>h4]:mt-6 [&>h4]:mb-2
              [&>p]:mb-4 [&>p]:text-gray-600 [&>p]:leading-relaxed
              [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul>li]:mb-1 [&>ul>li]:text-gray-600
              [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol>li]:mb-1 [&>ol>li]:text-gray-600
              [&>blockquote]:border-l-4 [&>blockquote]:border-gold-400 [&>blockquote]:bg-forest-50 [&>blockquote]:pl-6 [&>blockquote]:py-4 [&>blockquote]:pr-4 [&>blockquote]:my-6 [&>blockquote]:rounded-r-xl [&>blockquote]:italic [&>blockquote]:text-forest-800
              [&>strong]:text-forest-900 [&>strong]:font-semibold
            ">
              {/* Simple markdown-like rendering */}
              {post.content.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <br key={i} />;
                if (trimmed.startsWith('## ')) return <h2 key={i}>{trimmed.replace('## ', '')}</h2>;
                if (trimmed.startsWith('### ')) return <h3 key={i}>{trimmed.replace('### ', '')}</h3>;
                if (trimmed.startsWith('#### ')) return <h4 key={i}>{trimmed.replace('#### ', '')}</h4>;
                if (trimmed.startsWith('> ')) return <blockquote key={i}><p>{trimmed.replace('> ', '')}</p></blockquote>;
                if (trimmed.startsWith('- **')) {
                  const match = trimmed.match(/^- \*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
                  if (match) return <p key={i}>• <strong>{match[1]}</strong> — {match[2]}</p>;
                  return <p key={i}>• {trimmed.replace('- ', '')}</p>;
                }
                if (trimmed.startsWith('- ')) return <p key={i}>• {trimmed.replace('- ', '')}</p>;
                if (trimmed.match(/^\d+\.\s/)) return <p key={i}>{trimmed}</p>;
                if (trimmed.startsWith('**') && trimmed.endsWith('**')) return <p key={i}><strong>{trimmed.replace(/\*\*/g, '')}</strong></p>;
                // Handle inline bold
                const parts = trimmed.split(/(\*\*.+?\*\*)/g);
                if (parts.length > 1) {
                  return (
                    <p key={i}>
                      {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={j}>{part.replace(/\*\*/g, '')}</strong>;
                        }
                        return part;
                      })}
                    </p>
                  );
                }
                return <p key={i}>{trimmed}</p>;
              })}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-forest-100">
              <Tag className="w-4 h-4 text-gray-400" />
              {post.tags.map(tag => (
                <span key={tag} className="text-xs bg-forest-50 text-forest-600 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12 bg-forest-900 rounded-2xl p-8">
            <h3 className="font-heading text-2xl font-bold text-white mb-3">Love What You Read?</h3>
            <p className="text-white/70 mb-6">Try our products and experience the power of nature firsthand.</p>
            <a
              href="https://wa.me/254794368339?text=Hi%20Dua%20Organics!%20I%20just%20read%20your%20blog%20and%20I'd%20love%20to%20try%20your%20products!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
            >
              💬 Shop on WhatsApp
            </a>
          </div>

          {/* More Posts */}
          <div className="mt-16">
            <h3 className="font-heading text-2xl font-bold text-forest-900 mb-8 text-center floral-heading">
              More from Our Journal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherPosts.map(p => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow flex"
                >
                  <div className="w-32 shrink-0 overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-4 flex flex-col justify-center">
                    <span className="text-xs text-forest-500 font-medium">{p.category}</span>
                    <h4 className="font-heading font-semibold text-forest-900 group-hover:text-gold-600 transition-colors line-clamp-2 mt-1">
                      {p.title}
                    </h4>
                    <span className="text-xs text-gray-400 mt-1">{p.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
