import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './context/UserContext';
import MainLayout from './components/layout/MainLayout';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;