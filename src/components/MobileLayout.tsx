import { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MobileLayout({ children, className = '' }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className={`mx-auto max-w-md min-h-screen w-full relative shadow-xl ${className}`}>
        {children}
      </div>
    </div>
  );
}