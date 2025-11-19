import { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MobileLayout({ children, className = '' }: MobileLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={`mx-auto max-w-md w-full relative shadow-xl ${className}`} style={{ aspectRatio: '1675/3584' }}>
        {children}
      </div>
    </div>
  );
}