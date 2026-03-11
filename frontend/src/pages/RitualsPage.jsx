import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useCatalog, useCatalogItem } from '../hooks';
import { ElementBadge, Card, Select, EmptyState, Spinner } from '../components/ui';

const ELEMENTS = ['sangue','morte','conhecimento','energia','medo'];
const CIRCLES = [1,2,3,4];
const EXECUTION_ICONS = { padrão: '⬡', movimento: '↗', completa: '◉', livre: '◇', reação: '↺' };

export default function RitualsPage() {
  const [search, setSearch] = useState('');
  const [element, setElement] = useState('');
  const [circle, setCircle] = useState('');
  const [expanded, setExpanded] = useState(null);

  const params = {};
  if (search) params.search = search;
  if (element) params.element = element;
  if (circle) params.circle = circle;

  const { data: rituals, loading } = useCatalog('rituals', params);

  // Agrupar por elemento
  const grouped = rituals.reduce((acc, r) => {
    const el = r.element || 'nenhum';
    if (!acc[el]) acc[el] = [];
    acc[el].push(r);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-display)', letterSpacing: '0.25em' }}>ORDO REALITAS — GRIMÓRIO</p>
        <h1 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>Rituais</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Catálogo completo de rituais do Outro Lado.</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ritual..."
            className="w-full bg-stone-900/80 border border-stone-700 text-stone-200 rounded px-3 py-2.5 pl-9 text-sm focus:outline-none focus:border-stone-500"
            style={{ fontFamily: 'var(--font-body)' }} />
        </div>
        <Select value={element} onChange={e => setElement(e.target.value)} className="w-36">
          <option value="">Elemento</option>
          {ELEMENTS.map(el => <option key={el} value={el}>{el.charAt(0).toUpperCase() + el.slice(1)}</option>)}
        </Select>
        <Select value={circle} onChange={e => setCircle(e.target.value)} className="w-32">
          <option value="">Círculo</option>
          {CIRCLES.map(c => <option key={c} value={c}>{c}º Círculo</option>)}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : rituals.length === 0 ? (
        <EmptyState icon={<span style={{ fontSize: '2rem' }}>📜</span>} title="Nenhum ritual encontrado" />
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([el, items]) => (
            <div key={el}>
              <div className="flex items-center gap-3 mb-3">
                <ElementBadge element={el} />
                <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-display)' }}>
                  {items.length} ritual{items.length !== 1 ? 'is' : ''}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {items.map(ritual => (
                  <Card key={ritual.id} hover className="overflow-hidden">
                    <button className="w-full p-4 text-left" onClick={() => setExpanded(expanded === ritual.id ? null : ritual.id)}>
                      <div className="flex items-center gap-3">
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--text-muted)' }}>
                          {EXECUTION_ICONS[ritual.execution] || '◆'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.05em' }}>{ritual.name}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '9px' }}>
                              {ritual.circle}º CÍRCULO
                            </span>
                            {ritual.element_secondary && <ElementBadge element={ritual.element_secondary} />}
                          </div>
                          <div className="flex gap-3 mt-1 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {ritual.execution && <span>{ritual.execution}</span>}
                            {ritual.range && <span>· {ritual.range}</span>}
                            {ritual.pe_cost && <span>· {ritual.pe_cost} PE</span>}
                          </div>
                        </div>
                      </div>
                    </button>

                    {expanded === ritual.id && (
                      <RitualDetail slug={ritual.slug} />
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RitualDetail({ slug }) {
  const { data, loading } = useCatalogItem('rituals', slug);
  if (loading) return <div className="px-4 pb-4"><Spinner size={20} /></div>;
  if (!data) return null;
  return (
    <div className="px-4 pb-4 border-t border-stone-800/60 pt-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
        {data.target   && <span><strong style={{ color: 'var(--text-secondary)' }}>Alvo:</strong> {data.target}</span>}
        {data.duration && <span><strong style={{ color: 'var(--text-secondary)' }}>Duração:</strong> {data.duration}</span>}
        {data.resistance && <span><strong style={{ color: 'var(--text-secondary)' }}>Resist.:</strong> {data.resistance}</span>}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>{data.description}</p>
      {data.discente_description && (
        <div className="mt-3 p-3 rounded border border-stone-800 bg-stone-900/30">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '6px' }}>
            DISCENTE +{data.discente_cost} PE
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{data.discente_description}</p>
        </div>
      )}
      {data.verdadeiro_description && (
        <div className="mt-2 p-3 rounded border border-stone-800 bg-stone-900/30">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.1em', color: '#f0c040', marginBottom: '6px' }}>
            VERDADEIRO +{data.verdadeiro_cost} PE {data.verdadeiro_circle_required && `· requer ${data.verdadeiro_circle_required}º círculo`}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{data.verdadeiro_description}</p>
        </div>
      )}
    </div>
  );
}