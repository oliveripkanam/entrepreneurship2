import { useState, useEffect } from 'react';
import { ChevronLeft, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';

type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile' | 'edit-profile' | 'general-settings' | 'privacy-security' | 'help-center' | 'contact-support' | 'faq' | 'terms' | 'privacy-policy' | 'how-pantry-works';

interface Props {
  onNavigate: (screen: Screen) => void;
}

export function EditProfile({ onNavigate }: Props) {
  const { profile, user, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.display_name || 'Smart Shopper');
  const [email, setEmail] = useState(user?.email || '');
  const [emailError, setEmailError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setName(profile.display_name);
    if (user) setEmail(user.email || '');
  }, [profile, user]);

  const handleSave = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setSaving(true);
    try {
      if (profile && profile.display_name !== name) {
        await supabase.from('profiles').update({ display_name: name }).eq('id', profile.id);
        await refreshProfile();
      }
      onNavigate('profile');
    } catch (error) {
      console.error('Error saving profile', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <button onClick={() => onNavigate('profile')}>
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-gray-800">Edit Profile</h1>
        <div className="w-6" />
      </div>

      <div className="p-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div style={{ position: 'relative', width: '96px', height: '96px', flexShrink: 0 }}>
            <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'white', lineHeight: 1 }}>
                {name.trim().charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'white', border: '2px solid #4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              <Camera className="w-4 h-4 text-[#4CAF50]" />
            </div>
          </div>
          <p className="text-gray-400 text-sm">Profile picture coming soon</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#4CAF50] focus:outline-none text-gray-800"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
            placeholder="Enter your email"
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none text-gray-800 ${
              emailError ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#4CAF50]'
            }`}
          />
          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
        </div>

        <div style={{ marginTop: '24px', paddingBottom: '16px' }}>
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="w-full py-4 bg-[#4CAF50] text-white rounded-xl font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
