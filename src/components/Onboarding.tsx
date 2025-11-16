import { useEffect, useState } from 'react';
import { MobileLayout } from './MobileLayout';

interface OnboardingProps {
  onGetStarted: () => void;
}

export function Onboarding({ onGetStarted }: OnboardingProps) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 w-full h-full z-40`}
      style={{ 
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 700ms ease-in-out'
      }}
    >
      <MobileLayout className="bg-white">
        {/* Background Image - Blurred grocery delivery person */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?q=80&w=1200&auto=format&fit=crop')`,
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-end pb-16 px-8">
          {/* Logo icon */}
          <div className="mb-8">
            <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 10C50 10 45 5 40 10C35 5 30 10 30 10C30 10 25 15 30 20L40 35L50 20C55 15 50 10 50 10Z" fill="white" fillOpacity="0.95"/>
              <path d="M40 35C40 35 35 40 30 50C25 60 28 70 35 73C42 76 48 72 50 65C52 58 55 50 52 42C49 34 45 38 40 35Z" fill="white"/>
            </svg>
          </div>

          {/* Welcome text */}
          <div className="text-center mb-8">
            <h1 className="text-white text-5xl font-semibold mb-2">Welcome</h1>
            <h2 className="text-white text-4xl font-semibold mb-4">to our store</h2>
            <p className="text-white/90 text-base">Get your groceries in as fast as one hour</p>
          </div>

          {/* Get Started button */}
          <button 
            onClick={onGetStarted}
            className="w-full bg-[#4CAF50] text-white py-5 rounded-2xl font-semibold text-lg shadow-lg hover:bg-[#45a049] transition-colors"
          >
            Get Started
          </button>
        </div>
      </MobileLayout>
    </div>
  );
}

