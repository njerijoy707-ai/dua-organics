/**
 * Dua Organics — Login & Register Page
 * 
 * Combined authentication page with toggle between login and register forms.
 * Connects to AuthContext for state management.
 */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  /* Handle form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          /* Redirect admin to admin panel, customers to dashboard */
          navigate(result.isAdmin ? '/admin' : '/dashboard');
        } else {
          setError(result.error || 'Invalid email or password.');
        }
      } else {
        if (!name || !email || !phone || !password) {
          setError('Please fill in all fields.');
          setLoading(false);
          return;
        }
        const result = await register(name, email, phone, password);
        if (result.success && !result.error) {
          navigate('/dashboard');
        } else if (result.success && result.error) {
          /* Signed up but needs email confirmation first */
          setError(result.error);
        } else {
          setError(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Register'} — Dua Organics</title>
        <meta name="description" content="Sign in to your Dua Organics account to view orders, manage addresses, and shop organic skincare." />
      </Helmet>

      <main className="pt-24 pb-20 bg-cream-50 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <Leaf className="w-10 h-10 text-forest-600 mx-auto mb-3" />
              <h1 className="font-heading text-3xl font-bold text-forest-900">
                {isLogin ? 'Welcome Back' : 'Join Dua Organics'}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field — register only */}
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Phone — register only */}
              {!isLogin && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                    placeholder="0712345678"
                  />
                </div>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-forest-700 hover:bg-forest-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Toggle Login/Register */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-forest-700 hover:text-gold-600 font-semibold transition-colors"
                >
                  {isLogin ? 'Register' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
