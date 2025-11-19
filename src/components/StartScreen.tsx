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
      className={`fixed inset-0 w-full h-full z-40`}
      style={{ 
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 700ms ease-in-out',
        backgroundColor: 'transparent'
      }}
    >
      <div className="min-h-screen flex items-center justify-center">
        <div className="mx-auto max-w-md w-full relative shadow-xl overflow-hidden" style={{ aspectRatio: '1675/3584' }}>
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
                backgroundColor: '#4FA56F',
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
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#458F5F'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4FA56F'}
              onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#3D8A5A'}
              onMouseUp={(e) => e.currentTarget.style.backgroundColor = '#4FA56F'}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

