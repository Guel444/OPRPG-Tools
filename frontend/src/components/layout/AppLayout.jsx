import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  User, BookOpen, Swords, Scroll, Wand2, Skull,
  Package, Home, Menu, X, ChevronRight, LogOut, Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { path: '/',             label: 'Início',          icon: Home },
  { path: '/characters',  label: 'Fichas',           icon: User },
  { path: '/bestiary',    label: 'Bestiário',        icon: Skull },
  { path: '/rituals',     label: 'Rituais',          icon: Scroll },
  { path: '/arsenal',     label: 'Arsenal',          icon: Swords },
  { path: '/powers',      label: 'Poderes',          icon: Wand2 },
  { path: '/gm-tools',    label: 'Mesa do Mestre',   icon: Package },
  { path: '/secret-files',label: 'Arquivos Secretos',icon: Lock, requiresAuth: true },
];

export function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--ink)' }}>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          w-64 border-r border-stone-800/60
          transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        style={{
          background: 'var(--ink-2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo */}
        <div className="p-5 border-b border-stone-800/60">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded border border-red-800/60 flex items-center justify-center"
              style={{ background: 'rgba(192,57,43,0.1)' }}>
              <span style={{ color: '#e57373', fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700 }}>OP</span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>
                ORDEM PARANORMAL
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
                FERRAMENTAS
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          {NAV_ITEMS.map(({ path, label, icon: Icon, requiresAuth }) => {
            const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
            const locked = requiresAuth && (!user || !user.isSubscriber);
            return (
              <Link
                key={path}
                to={locked ? '#' : path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded mb-0.5 group
                  transition-all duration-150
                  ${active
                    ? 'bg-red-900/20 border border-red-800/40 text-red-300'
                    : 'border border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                  }
                  ${locked ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <Icon size={16} className={active ? 'text-red-400' : 'text-stone-500 group-hover:text-stone-300'} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.1em' }}>
                  {label}
                </span>
                {active && <ChevronRight size={12} className="ml-auto text-red-600" />}
                {locked && <Lock size={10} className="ml-auto text-stone-600" />}
              </Link>
            );
          })}
        </nav>

        {/* Usuário */}
        <div className="p-3 border-t border-stone-800/60">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center bg-stone-800 flex-shrink-0">
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {user.username?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-stone-300 truncate" style={{ fontFamily: 'var(--font-display)' }}>
                  {user.username}
                </div>
                {user.isSubscriber && (
                  <div className="text-xs" style={{ color: '#f0c040', fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.1em' }}>
                    ASSINANTE
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="text-stone-600 hover:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded border border-stone-700 text-stone-400 hover:border-stone-500 hover:text-stone-200 transition-all"
              style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.1em' }}
            >
              <User size={14} />
              ENTRAR
            </Link>
          )}
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0">
        {/* Header mobile */}
        <header className="md:hidden sticky top-0 z-10 flex items-center justify-between px-4 h-14 border-b border-stone-800/60"
          style={{ background: 'var(--ink-2)' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-stone-400">
            <Menu size={20} />
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>
            ORDEM PARANORMAL
          </span>
          <div className="w-6" />
        </header>

        {/* Conteúdo */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}