import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Onboarding } from './components/Onboarding';
import { MobileLayout } from './components/MobileLayout';
import { Home } from './components/Home';
import { BasketComparison } from './components/BasketComparison';
import { RecipeToList } from './components/RecipeToList';
import { DietaryFilters } from './components/DietaryFilters';
import { SocialRecipes } from './components/SocialRecipes';
import { PriceHistory } from './components/PriceHistory';
import { Notifications } from './components/Notifications';
import { Profile } from './components/Profile';
import { Home as HomeIcon, ShoppingCart, Utensils, Bell, User } from 'lucide-react';

type AppState = 'splash' | 'onboarding' | 'app';
type Screen = 'home' | 'basket' | 'recipe' | 'dietary' | 'social' | 'price-history' | 'notifications' | 'profile';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const handleSplashFinish = () => {
    setTimeout(() => setAppState('onboarding'), 600);
  };

  const handleGetStarted = () => {
    setAppState('app');
  };

  if (appState === 'splash') {
    return (
      <>
        <Onboarding onGetStarted={handleGetStarted} />
        <SplashScreen onFinish={handleSplashFinish} />
      </>
    );
  }

  if (appState === 'onboarding') {
    return <Onboarding onGetStarted={handleGetStarted} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onNavigate={setCurrentScreen} />;
      case 'basket':
        return <BasketComparison onNavigate={setCurrentScreen} />;
      case 'recipe':
        return <RecipeToList onNavigate={setCurrentScreen} />;
      case 'dietary':
        return <DietaryFilters onNavigate={setCurrentScreen} />;
      case 'social':
        return <SocialRecipes onNavigate={setCurrentScreen} />;
      case 'price-history':
        return <PriceHistory onNavigate={setCurrentScreen} />;
      case 'notifications':
        return <Notifications onNavigate={setCurrentScreen} />;
      case 'profile':
        return <Profile onNavigate={setCurrentScreen} />;
      default:
        return <Home onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <MobileLayout className="bg-white pb-20">
      {renderScreen()}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex justify-around items-center">
          <button 
            onClick={() => setCurrentScreen('home')}
            className="flex flex-col items-center gap-1"
          >
            <HomeIcon className={`w-6 h-6 ${currentScreen === 'home' ? 'text-[#4CAF50]' : 'text-gray-400'}`} />
            <span className={`text-xs ${currentScreen === 'home' ? 'text-[#4CAF50]' : 'text-gray-400'}`}>Home</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('basket')}
            className="flex flex-col items-center gap-1"
          >
            <ShoppingCart className={`w-6 h-6 ${currentScreen === 'basket' ? 'text-[#4CAF50]' : 'text-gray-400'}`} />
            <span className={`text-xs ${currentScreen === 'basket' ? 'text-[#4CAF50]' : 'text-gray-400'}`}>Basket</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('social')}
            className="flex flex-col items-center gap-1"
          >
            <Utensils className={`w-6 h-6 ${currentScreen === 'social' ? 'text-[#4CAF50]' : 'text-gray-400'}`} />
            <span className={`text-xs ${currentScreen === 'social' ? 'text-[#4CAF50]' : 'text-gray-400'}`}>Recipes</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('profile')}
            className="flex flex-col items-center gap-1"
          >
            <User className={`w-6 h-6 ${currentScreen === 'profile' ? 'text-[#4CAF50]' : 'text-gray-400'}`} />
            <span className={`text-xs ${currentScreen === 'profile' ? 'text-[#4CAF50]' : 'text-gray-400'}`}>Profile</span>
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}