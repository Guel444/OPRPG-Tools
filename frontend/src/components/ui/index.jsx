import React from 'react';

/* ============================================================
   BOTÃO
   ============================================================ */
export function Button({ children, variant = 'primary', size = 'md', disabled, loading, onClick, type = 'button', className = '' }) {
  const base = `
    inline-flex items-center justify-center gap-2 font-display tracking-wider uppercase
    transition-all duration-200 cursor-pointer border select-none
    disabled:opacity-40 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-transparent border-red-700 text-red-400
      hover:bg-red-900/20 hover:border-red-500 hover:text-red-300
      active:bg-red-900/40
      focus:outline-none focus:ring-1 focus:ring-red-700
    `,
    secondary: `
      bg-transparent border-stone-600 text-stone-300
      hover:bg-stone-800/50 hover:border-stone-400 hover:text-stone-100
    `,
    ghost: `
      bg-transparent border-transparent text-stone-400
      hover:bg-stone-800/30 hover:text-stone-200
    `,
    danger: `
      bg-red-900/20 border-red-800 text-red-400
      hover:bg-red-900/40 hover:border-red-600
    `,
    element: `
      bg-transparent border-current opacity-70 hover:opacity-100
    `,
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded',
    md: 'text-xs px-5 py-2.5 rounded',
    lg: 'text-sm px-7 py-3.5 rounded',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}
    >
      {loading && <Spinner size={size === 'sm' ? 12 : 16} />}
      {children}
    </button>
  );
}

/* ============================================================
   CARD
   ============================================================ */
export function Card({ children, className = '', hover = false, glow = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded bg-stone-900/60 border border-stone-800/80
        ${hover ? 'transition-all duration-200 hover:border-stone-600 hover:bg-stone-800/60 cursor-pointer' : ''}
        ${glow ? 'hover:shadow-[0_0_20px_rgba(192,57,43,0.15)]' : ''}
        ${className}
      `}
      style={{ backdropFilter: 'blur(4px)' }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-5 pt-5 pb-3 border-b border-stone-800/60 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

/* ============================================================
   INPUT
   ============================================================ */
export function Input({ label, error, prefix, suffix, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs uppercase tracking-widest text-stone-400" style={{ fontFamily: 'var(--font-display)' }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-3 text-stone-500 text-sm">{prefix}</span>}
        <input
          {...props}
          className={`
            w-full bg-stone-900/80 border text-stone-200 rounded px-3 py-2.5 text-sm
            placeholder:text-stone-600
            transition-all duration-150
            focus:outline-none
            ${error ? 'border-red-700 focus:border-red-500' : 'border-stone-700 focus:border-stone-500'}
            ${prefix ? 'pl-8' : ''}
            ${suffix ? 'pr-8' : ''}
            ${className}
          `}
          style={{ fontFamily: 'var(--font-body)' }}
        />
        {suffix && <span className="absolute right-3 text-stone-500 text-sm">{suffix}</span>}
      </div>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs uppercase tracking-widest text-stone-400" style={{ fontFamily: 'var(--font-display)' }}>
          {label}
        </label>
      )}
      <select
        {...props}
        className={`
          w-full bg-stone-900/80 border border-stone-700 text-stone-200 rounded px-3 py-2.5 text-sm
          focus:outline-none focus:border-stone-500 transition-all duration-150
          ${error ? 'border-red-700' : ''}
          ${className}
        `}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {children}
      </select>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}

/* ============================================================
   BADGE DE ELEMENTO
   ============================================================ */
const ELEMENT_COLORS = {
  sangue:       { bg: 'rgba(192,57,43,0.12)', border: 'rgba(192,57,43,0.35)', text: '#e57373' },
  morte:        { bg: 'rgba(108,92,231,0.12)', border: 'rgba(108,92,231,0.35)', text: '#a991f7' },
  conhecimento: { bg: 'rgba(212,160,23,0.12)', border: 'rgba(212,160,23,0.35)', text: '#f0c040' },
  energia:      { bg: 'rgba(0,180,216,0.12)', border: 'rgba(0,180,216,0.35)', text: '#48cae4' },
  medo:         { bg: 'rgba(45,106,79,0.12)', border: 'rgba(45,106,79,0.35)', text: '#52b788' },
  nenhum:       { bg: 'rgba(90,87,80,0.12)', border: 'rgba(90,87,80,0.35)', text: '#9e9a8e' },
};

export function ElementBadge({ element }) {
  const c = ELEMENT_COLORS[element?.toLowerCase()] || ELEMENT_COLORS.nenhum;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontFamily: 'var(--font-display)' }}
    >
      {element || 'Sem elemento'}
    </span>
  );
}

/* ============================================================
   VD BADGE
   ============================================================ */
export function VDBadge({ vd }) {
  const color = vd < 100 ? '#9e9a8e' : vd < 200 ? '#f0c040' : vd < 300 ? '#e57373' : '#a991f7';
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold"
      style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${color}40`, color }}
    >
      VD {vd}
    </span>
  );
}

/* ============================================================
   STAT TRIO (AGI/FOR/INT/PRE/VIG)
   ============================================================ */
export function StatGrid({ agi, for: FOR, int: INT, pre, vig }) {
  const stats = [
    { label: 'AGI', value: agi },
    { label: 'FOR', value: FOR },
    { label: 'INT', value: INT },
    { label: 'PRE', value: pre },
    { label: 'VIG', value: vig },
  ];
  return (
    <div className="grid grid-cols-5 gap-2">
      {stats.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center py-2 px-1 rounded border border-stone-800 bg-stone-900/40">
          <span className="text-xs text-stone-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-display)' }}>{label}</span>
          <span className="text-lg font-bold text-stone-200" style={{ fontFamily: 'var(--font-mono)' }}>{value ?? '—'}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   BARRA DE RECURSO (PV/PE/SAN)
   ============================================================ */
export function ResourceBar({ label, current, max, color = '#c0392b' }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs uppercase tracking-wider text-stone-500" style={{ fontFamily: 'var(--font-display)' }}>{label}</span>
        <span className="text-xs font-mono text-stone-300">{current}/{max}</span>
      </div>
      <div className="h-1.5 rounded-full bg-stone-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   SPINNER
   ============================================================ */
export function Spinner({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      className="animate-spin"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

/* ============================================================
   TOOLTIP SIMPLES
   ============================================================ */
export function Tooltip({ children, tip }) {
  return (
    <span className="relative group inline-flex">
      {children}
      {tip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs bg-stone-800 border border-stone-700 text-stone-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {tip}
        </span>
      )}
    </span>
  );
}

/* ============================================================
   EMPTY STATE
   ============================================================ */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {icon && <div className="text-stone-600 mb-4">{icon}</div>}
      <h3 className="text-stone-400 text-lg mb-2" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
      {description && <p className="text-stone-600 text-sm max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}