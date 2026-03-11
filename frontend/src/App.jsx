import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Spinner } from './components/ui';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationContainer } from './components/notifications/NotificationContainer';
import './styles/globals.css';

// Lazy loading de todas as páginas
const HomePage        = lazy(() => import('./pages/HomePage'));
const LoginPage       = lazy(() => import('./pages/LoginPage'));
const RegisterPage    = lazy(() => import('./pages/RegisterPage'));
const CharactersPage  = lazy(() => import('./pages/CharactersPage'));
const CharacterCreate = lazy(() => import('./pages/CharacterCreatePage'));
const CharacterView   = lazy(() => import('./pages/CharacterViewPage'));
const BestiaryPage    = lazy(() => import('./pages/BestiaryPage'));
const CreaturePage    = lazy(() => import('./pages/CreaturePage'));
const RitualsPage     = lazy(() => import('./pages/RitualsPage'));
const ArsenalPage     = lazy(() => import('./pages/ArsenalPage'));
const PowersPage      = lazy(() => import('./pages/PowersPage'));
const GmToolsPage     = lazy(() => import('./pages/GmToolsPage'));
const SecretFilesPage = lazy(() => import('./pages/SecretFilesPage'));

// Guard para rotas autenticadas
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Guard para rotas de assinante
function SubscriberRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isSubscriber) return <Navigate to="/subscribe" replace />;
  return children;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size={32} />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
          CARREGANDO ARQUIVOS...
        </span>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <AppLayout>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Personagens — requer login */}
          <Route path="/characters" element={<ProtectedRoute><CharactersPage /></ProtectedRoute>} />
          <Route path="/characters/new" element={<ProtectedRoute><CharacterCreate /></ProtectedRoute>} />
          <Route path="/characters/:id" element={<ProtectedRoute><CharacterView /></ProtectedRoute>} />
          <Route path="/characters/share/:token" element={<CharacterView shared />} />

          {/* Catálogos — públicos */}
          <Route path="/bestiary" element={<BestiaryPage />} />
          <Route path="/bestiary/:slug" element={<CreaturePage />} />
          <Route path="/rituals" element={<RitualsPage />} />
          <Route path="/arsenal" element={<ArsenalPage />} />
          <Route path="/powers" element={<PowersPage />} />

          {/* Mestre — público */}
          <Route path="/gm-tools" element={<GmToolsPage />} />

          {/* Arquivos Secretos — requer assinante */}
          <Route path="/secret-files" element={<SubscriberRoute><SecretFilesPage /></SubscriberRoute>} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <NotificationContainer />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}