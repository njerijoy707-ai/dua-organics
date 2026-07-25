/**
 * Dua Organics — Admin Panel
 * 
 * Admin dashboard for managing products, orders, and blog posts.
 * Protected route — only accessible to admin users.
 */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { Package, ShoppingBag, FileText, BarChart3, Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { type Product } from '../data/products';
import { type BlogPost } from '../data/blog';
import { uploadMediaFile } from '../lib/supabase';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'blog';

export default function AdminPage() {
  const { isAuthenticated, isAdmin, user, orders, loading: authLoading } = useAuth();
  const {
    products, blogPosts, loading: dataLoading, error: dataError,
    saveProduct, deleteProduct, savePost, deletePost,
  } = useData();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  /* Wait for the session check before deciding whether to redirect —
   * otherwise a page refresh briefly bounces admins to /login. */
  if (authLoading) {
    return <main className="pt-24 pb-20 min-h-screen flex items-center justify-center text-gray-400">Loading…</main>;
  }

  /* Protect route — admin only */
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/dashboard" />;

  /* Handle product save (add or update) — writes straight to Supabase */
  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    const isNew = !products.some(p => p.id === editingProduct.id);
    setSavingProduct(true);
    try {
      await saveProduct(editingProduct, isNew);
      setEditingProduct(null);
    } catch (err: any) {
      alert(`Failed to save product: ${err.message ?? 'unknown error'}`);
    } finally {
      setSavingProduct(false);
    }
  };

  /* Handle product delete */
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
    } catch (err: any) {
      alert(`Failed to delete product: ${err.message ?? 'unknown error'}`);
    }
  };

  /* Create new product template — id is a placeholder; Supabase assigns
   * the real id on insert (see productToRow in DataContext, which omits it). */
  const handleNewProduct = () => {
    setEditingProduct({
      id: crypto.randomUUID(),
      name: '',
      slug: '',
      price: 0,
      currency: 'KES',
      description: '',
      longDescription: '',
      image: '',
      rating: 0,
      reviewCount: 0,
      category: '',
      inStock: true,
      reviews: [],
    });
  };

  /* Handle blog post save */
  const handleSavePost = async () => {
    if (!editingPost) return;
    const isNew = !blogPosts.some(p => p.id === editingPost.id);
    setSavingPost(true);
    try {
      await savePost(editingPost, isNew);
      setEditingPost(null);
    } catch (err: any) {
      alert(`Failed to save post: ${err.message ?? 'unknown error'}`);
    } finally {
      setSavingPost(false);
    }
  };

  /* Handle blog post delete */
  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await deletePost(id);
    } catch (err: any) {
      alert(`Failed to delete post: ${err.message ?? 'unknown error'}`);
    }
  };

  /* Upload an image file straight to Supabase Storage and drop the public
   * URL into whichever editor (product or post) is currently open. */
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'product' | 'post'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadMediaFile(file, target === 'product' ? 'products' : 'blog');
      if (target === 'product') {
        setEditingProduct(prev => (prev ? { ...prev, image: url } : prev));
      } else {
        setEditingPost(prev => (prev ? { ...prev, image: url } : prev));
      }
    } catch (err: any) {
      alert(`Image upload failed: ${err.message ?? 'unknown error'}`);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  /* Create new blog post template */
  const handleNewPost = () => {
    setEditingPost({
      id: `blog-${Date.now()}`,
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image: '',
      author: 'Dua Organics Team',
      authorAvatar: '🌿',
      date: new Date().toISOString().split('T')[0],
      readTime: '5 min read',
      category: '',
      tags: [],
      metaTitle: '',
      metaDescription: '',
    });
  };

  const tabs: { id: AdminTab; label: string; icon: typeof Package }[] = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'blog', label: 'Blog Posts', icon: FileText },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Panel — Dua Organics</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="pt-24 pb-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-forest-900">
              Admin Panel
            </h1>
            <p className="text-gray-500 mt-1">Welcome, {user?.name}. Manage your store.</p>
          </div>

          {dataError && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">
              Couldn't load store data: {dataError}
            </div>
          )}
          {dataLoading && !dataError && (
            <div className="bg-forest-50 text-forest-700 text-sm px-4 py-3 rounded-lg mb-6">
              Loading products & posts…
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-forest-700 text-white'
                          : 'text-gray-600 hover:bg-forest-50'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

                {/* ===== Dashboard Overview ===== */}
                {activeTab === 'dashboard' && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-forest-900 mb-6">Store Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      {[
                        { label: 'Total Products', value: products.length, color: 'bg-forest-100 text-forest-700' },
                        { label: 'Total Orders', value: orders.length, color: 'bg-blue-100 text-blue-700' },
                        { label: 'Blog Posts', value: blogPosts.length, color: 'bg-purple-100 text-purple-700' },
                        { label: 'Revenue (KES)', value: orders.reduce((sum, o) => sum + o.total, 0).toLocaleString(), color: 'bg-gold-100 text-gold-600' },
                      ].map((stat, i) => (
                        <div key={i} className={`${stat.color} rounded-xl p-5`}>
                          <p className="text-sm font-medium opacity-80">{stat.label}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-forest-50 rounded-xl p-6">
                      <h3 className="font-semibold text-forest-900 mb-2">Quick Actions</h3>
                      <div className="flex flex-wrap gap-3">
                        <button onClick={() => { setActiveTab('products'); handleNewProduct(); }} className="bg-forest-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors">
                          + Add Product
                        </button>
                        <button onClick={() => { setActiveTab('blog'); handleNewPost(); }} className="bg-forest-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-forest-800 transition-colors">
                          + New Blog Post
                        </button>
                        <a href="https://wa.me/254794368339" target="_blank" rel="noopener noreferrer" className="bg-gold-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold-600 transition-colors">
                          WhatsApp Orders
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* ===== Products Management ===== */}
                {activeTab === 'products' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-heading text-2xl font-bold text-forest-900">Manage Products</h2>
                      <button
                        onClick={handleNewProduct}
                        className="flex items-center gap-1 bg-forest-700 hover:bg-forest-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Product
                      </button>
                    </div>

                    {/* Product Editor Modal */}
                    {editingProduct && (
                      <div className="bg-forest-50 rounded-xl p-6 mb-6 border border-forest-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-forest-900">
                            {products.find(p => p.id === editingProduct.id) ? 'Edit Product' : 'New Product'}
                          </h3>
                          <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Product Name</label>
                            <input
                              type="text" value={editingProduct.name}
                              onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                              placeholder="Product name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Price (KES)</label>
                            <input
                              type="number" value={editingProduct.price}
                              onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                            <input
                              type="text" value={editingProduct.category}
                              onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                              placeholder="e.g., Skincare"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Product Image</label>
                            <div className="flex items-center gap-4">
                              {editingProduct.image && (
                                <img src={editingProduct.image} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                              )}
                              <div className="flex-1 space-y-2">
                                <input
                                  type="url" value={editingProduct.image}
                                  onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                                  placeholder="Paste an image URL, or upload a file below"
                                />
                                <input
                                  type="file" accept="image/*"
                                  onChange={e => handleImageUpload(e, 'product')}
                                  disabled={uploadingImage}
                                  className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-forest-100 file:text-forest-700 hover:file:bg-forest-200"
                                />
                                {uploadingImage && <p className="text-xs text-forest-600">Uploading…</p>}
                              </div>
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Short Description</label>
                            <input
                              type="text" value={editingProduct.description}
                              onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                              placeholder="Brief description..."
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">Full Description</label>
                            <textarea
                              value={editingProduct.longDescription}
                              onChange={e => setEditingProduct({ ...editingProduct, longDescription: e.target.value })}
                              rows={4}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                              placeholder="Detailed product description..."
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={handleSaveProduct}
                            disabled={savingProduct}
                            className="flex items-center gap-1 bg-forest-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            {savingProduct ? 'Saving…' : 'Save Product'}
                          </button>
                          <button onClick={() => setEditingProduct(null)} className="text-gray-500 text-sm hover:text-gray-700">Cancel</button>
                        </div>
                      </div>
                    )}

                    {/* Products Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-3 px-2 text-gray-500 font-medium">Product</th>
                            <th className="text-left py-3 px-2 text-gray-500 font-medium">Category</th>
                            <th className="text-right py-3 px-2 text-gray-500 font-medium">Price</th>
                            <th className="text-center py-3 px-2 text-gray-500 font-medium">Rating</th>
                            <th className="text-right py-3 px-2 text-gray-500 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(product => (
                            <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-3">
                                  <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                  <span className="font-medium text-forest-900">{product.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-gray-500">{product.category}</td>
                              <td className="py-3 px-2 text-right font-medium">KES {product.price.toLocaleString()}</td>
                              <td className="py-3 px-2 text-center">{product.rating} ★</td>
                              <td className="py-3 px-2 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => setEditingProduct(product)}
                                    className="text-forest-600 hover:text-forest-800 p-1"
                                    aria-label="Edit product"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="text-red-400 hover:text-red-600 p-1"
                                    aria-label="Delete product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ===== Orders Management ===== */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-forest-900 mb-6">Manage Orders</h2>
                    <p className="text-gray-500 text-sm mb-4">
                      Orders are received via WhatsApp at <strong>+254 794 368 339</strong>. 
                      This panel shows demo order data for reference.
                    </p>
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="border border-gray-100 rounded-xl p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="font-semibold text-forest-900">{order.id}</span>
                              <span className="text-gray-400 text-sm ml-3">
                                {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <select
                              defaultValue={order.status}
                              className="text-xs font-semibold px-3 py-1 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm text-gray-600">
                                <span>{item.name} × {item.quantity}</span>
                                <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
                            <span className="font-semibold text-sm">Total</span>
                            <span className="font-bold text-forest-800">KES {order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ===== Blog Management ===== */}
                {activeTab === 'blog' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-heading text-2xl font-bold text-forest-900">Manage Blog Posts</h2>
                      <button
                        onClick={handleNewPost}
                        className="flex items-center gap-1 bg-forest-700 hover:bg-forest-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        New Post
                      </button>
                    </div>

                    {/* Blog Editor */}
                    {editingPost && (
                      <div className="bg-forest-50 rounded-xl p-6 mb-6 border border-forest-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-forest-900">
                            {blogPosts.find(p => p.id === editingPost.id) ? 'Edit Post' : 'New Post'}
                          </h3>
                          <button onClick={() => setEditingPost(null)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                              <input
                                type="text" value={editingPost.title}
                                onChange={e => setEditingPost({ ...editingPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                              <input
                                type="text" value={editingPost.category}
                                onChange={e => setEditingPost({ ...editingPost, category: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Excerpt</label>
                            <input
                              type="text" value={editingPost.excerpt}
                              onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Post Image</label>
                            <div className="flex items-center gap-4">
                              {editingPost.image && (
                                <img src={editingPost.image} alt="" className="w-14 h-14 rounded-lg object-cover border border-gray-200" />
                              )}
                              <div className="flex-1 space-y-2">
                                <input
                                  type="url" value={editingPost.image}
                                  onChange={e => setEditingPost({ ...editingPost, image: e.target.value })}
                                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                                  placeholder="Paste an image URL, or upload a file below"
                                />
                                <input
                                  type="file" accept="image/*"
                                  onChange={e => handleImageUpload(e, 'post')}
                                  disabled={uploadingImage}
                                  className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-forest-100 file:text-forest-700 hover:file:bg-forest-200"
                                />
                                {uploadingImage && <p className="text-xs text-forest-600">Uploading…</p>}
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Content (Markdown)</label>
                            <textarea
                              value={editingPost.content}
                              onChange={e => setEditingPost({ ...editingPost, content: e.target.value })}
                              rows={10}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forest-500"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
                              <input
                                type="text" value={editingPost.metaTitle}
                                onChange={e => setEditingPost({ ...editingPost, metaTitle: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
                              <input
                                type="text" value={editingPost.metaDescription}
                                onChange={e => setEditingPost({ ...editingPost, metaDescription: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={handleSavePost}
                            disabled={savingPost}
                            className="flex items-center gap-1 bg-forest-700 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-forest-800 transition-colors disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            {savingPost ? 'Saving…' : 'Publish Post'}
                          </button>
                          <button onClick={() => setEditingPost(null)} className="text-gray-500 text-sm hover:text-gray-700">Cancel</button>
                        </div>
                      </div>
                    )}

                    {/* Blog Posts List */}
                    <div className="space-y-3">
                      {blogPosts.map(post => (
                        <div key={post.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <img src={post.image} alt="" className="w-16 h-12 rounded-lg object-cover" />
                            <div>
                              <h3 className="font-medium text-forest-900 text-sm">{post.title}</h3>
                              <p className="text-xs text-gray-400">{post.category} · {post.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingPost(post)}
                              className="text-forest-600 hover:text-forest-800 p-2"
                              aria-label="Edit post"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-400 hover:text-red-600 p-2"
                              aria-label="Delete post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
