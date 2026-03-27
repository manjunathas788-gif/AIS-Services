import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Logo } from '../components/Logo';
import { Shield, LogIn, User, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginType, setLoginType] = useState<'customer' | 'staff'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      setError('Failed to login with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please check your credentials.');
      } else {
        setError('Failed to login. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-stone-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-stone-100 p-8 md:p-12"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-stone-50 rounded-2xl mb-6">
            <Logo className="h-12" />
          </div>
          <h2 className="text-3xl font-bold text-stone-900">Welcome Back</h2>
          <p className="mt-2 text-stone-600">Secure access to your AIS Solutions dashboard</p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex bg-stone-100 p-1 rounded-2xl mb-8">
          <button
            onClick={() => { setLoginType('customer'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              loginType === 'customer' ? 'bg-white text-orange-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Customer Login
          </button>
          <button
            onClick={() => { setLoginType('staff'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              loginType === 'staff' ? 'bg-white text-orange-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            Staff Login
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {loginType === 'customer' ? (
            <motion.div
              key="customer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 bg-white border border-stone-200 py-4 px-6 rounded-xl font-semibold text-stone-700 hover:bg-stone-50 transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-600"></div>
                ) : (
                  <>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="staff"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleEmailLogin}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Staff Email</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="staff@aissolutions.in"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-100 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-orange-100 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-xs text-stone-400 leading-relaxed">
            By continuing, you agree to AIS Solutions' <br />
            <a href="/terms" className="text-orange-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
