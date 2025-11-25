import { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MobileLayout({ children, className = '' }: MobileLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className={`mx-auto max-w-md w-full h-full relative shadow-xl overflow-hidden rounded-3xl ${className}`} style={{ aspectRatio: '9/19.5', maxHeight: '90vh' }}>
        {children}
      </div>
    </div>
  );
}