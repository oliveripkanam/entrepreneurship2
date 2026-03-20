import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

interface StartScreenProps {
  onGetStarted: () => void;
}

export function StartScreen({ onGetStarted }: StartScreenProps) {
  const [fadeIn, setFadeIn] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setMessage('Check your email for the confirmation link.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 w-full h-full z-40 bg-gray-100 flex items-center justify-center p-4`}
      style={{ 
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 700ms ease-in-out',
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Pantry</h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CAF50] focus:outline-none text-gray-800"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CAF50] focus:outline-none text-gray-800"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm py-1">{error}</p>}
          {message && <p className="text-green-600 text-sm py-1">{message}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#4CAF50] text-white py-3 rounded-xl font-medium mt-4 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

