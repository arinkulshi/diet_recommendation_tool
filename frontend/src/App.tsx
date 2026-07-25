import React from 'react';
import MainLayout from './components/layout/MainLayout';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import RecommendationsPage from './pages/RecommendationsPage';
import { usePathname } from './utils/routing';

const pages: Record<string, React.ReactNode> = {
  '/': <SearchPage />,
  '/favorites': <FavoritesPage />,
  '/recommendations': <RecommendationsPage />,
};

const App: React.FC = () => {
  const pathname = usePathname();

  return (
    <MainLayout>
      {pages[pathname] ?? <SearchPage />}
    </MainLayout>
  );
};

export default App;
