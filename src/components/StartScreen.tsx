import { useEffect, useState } from 'react';

interface StartScreenProps {
  onGetStarted: () => void;
}

export function StartScreen({ onGetStarted }: StartScreenProps) {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 w-full h-full z-40 bg-gray-100`}
      style={{ 
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 700ms ease-in-out',
      }}
    >
      <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 overflow-hidden">
        <div className="relative shadow-xl overflow-hidden rounded-3xl" style={{ height: '90vh', width: 'calc(90vh * (9/19.5))', maxWidth: '100vw' }}>
          <img 
            src="/images/StartScreen.png" 
            alt="Start Screen"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '0 24px 100px 24px', zIndex: 10 }}>
            <button 
              onClick={onGetStarted}
              style={{
                backgroundColor: '#4CAF50',
                borderRadius: '20px',
                padding: '20px',
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                width: '100%',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#45a049'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#3d8b40'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

