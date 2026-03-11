import React from 'react';
import { AlertTriangle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={this.reset} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, onReset }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-red-900/20 border border-red-800 mb-4">
            <AlertTriangle className="text-red-400" size={32} />
          </div>
          <h1
            className="text-2xl font-bold text-red-300 mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ERRO INESPERADO
          </h1>
          <p className="text-stone-400 text-sm mb-4">
            Algo deu errado durante a execução da aplicação.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-stone-900/50 border border-stone-800 rounded p-3 mb-4 text-left">
              <p className="text-xs text-stone-500 font-mono break-words">
                {error?.message || 'Erro desconhecido'}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={onReset}
            className="
              flex items-center justify-center gap-2 px-4 py-2.5 rounded
              bg-transparent border border-stone-600 text-stone-300
              hover:bg-stone-800/30 hover:border-stone-400 transition-all
              text-sm font-display uppercase tracking-wide
            "
          >
            Tentar novamente
          </button>
          <button
            onClick={() => navigate('/')}
            className="
              flex items-center justify-center gap-2 px-4 py-2.5 rounded
              bg-red-900/20 border border-red-800 text-red-400
              hover:bg-red-900/40 transition-all
              text-sm font-display uppercase tracking-wide
            "
          >
            <Home size={16} />
            Voltar ao início
          </button>
        </div>
      </div>
    </div>
  );
}
