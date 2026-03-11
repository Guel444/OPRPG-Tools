import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input } from '../components/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/characters');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--ink)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded border border-red-800/60 items-center justify-center mb-4"
            style={{ background: 'rgba(192,57,43,0.1)' }}>
            <span style={{ color: '#e57373', fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700 }}>OP</span>
          </div>
          <h1 className="mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', letterSpacing: '0.1em' }}>
            IDENTIFICAÇÃO
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Acesse sua conta de agente
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}
          className="rounded border border-stone-800 p-6 flex flex-col gap-4"
          style={{ background: 'var(--ink-2)' }}
        >
          {error && (
            <div className="rounded border border-red-800/50 px-3 py-2 text-sm text-red-400"
              style={{ background: 'rgba(192,57,43,0.08)' }}>
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="agente@ordo.com"
            required
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
            Entrar
          </Button>
        </form>

        <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Ainda não tem conta?{' '}
          <Link to="/register" style={{ color: '#e57373' }}>Registrar</Link>
        </p>
      </div>
    </div>
  );
}