import { useEffect, useState } from 'react';
import { MobileLayout } from './MobileLayout';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 700);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div 
      className="fixed inset-0 w-full h-full z-50"
      style={{ 
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 500ms ease-in-out',
        pointerEvents: fadeOut ? 'none' : 'auto'
      }}
    >
      <MobileLayout className="bg-[#4CAF50] flex items-center justify-center">
        <img 
          src="/images/SplashScreenIcon.png" 
          alt="Splash Screen Logo" 
          className="w-auto h-auto max-w-[200px]"
        />
      </MobileLayout>
    </div>
  );
}