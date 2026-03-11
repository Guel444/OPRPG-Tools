// ArsenalPage.jsx
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useCatalog } from '../hooks';
import { ElementBadge, Card, Select, EmptyState, Spinner } from '../components/ui';

const ITEM_TYPES = [
  { value: 'arma_simples',    label: 'Armas Simples' },
  { value: 'arma_tatica',     label: 'Armas Táticas' },
  { value: 'arma_pesada',     label: 'Armas Pesadas' },
  { value: 'protecao_leve',   label: 'Proteção Leve' },
  { value: 'protecao_pesada', label: 'Proteção Pesada' },
  { value: 'item_geral',      label: 'Itens Gerais' },
  { value: 'item_paranormal', label: 'Itens Paranormais' },
  { value: 'item_amaldicoado',label: 'Itens Amaldiçoados' },
  { value: 'recurso',         label: 'Recursos' },
];

const ELEMENTS = ['sangue','morte','conhecimento','energia','medo'];

export function ArsenalPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [element, setElement] = useState('');

  const params = {};
  if (search) params.search = search;
  if (type) params.type = type;
  if (element) params.element = element;

  const { data: items, loading } = useCatalog('items', params);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-display)', letterSpacing: '0.25em' }}>ORDO REALITAS — DEPÓSITO</p>
        <h1 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>Arsenal</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Armas, proteções e itens — mundanos, paranormais e amaldiçoados.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar item..."
            className="w-full bg-stone-900/80 border border-stone-700 text-stone-200 rounded px-3 py-2.5 pl-9 text-sm focus:outline-none focus:border-stone-500"
            style={{ fontFamily: 'var(--font-body)' }} />
        </div>
        <Select value={type} onChange={e => setType(e.target.value)} className="w-44">
          <option value="">Tipo</option>
          {ITEM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </Select>
        <Select value={element} onChange={e => setElement(e.target.value)} className="w-36">
          <option value="">Elemento</option>
          {ELEMENTS.map(el => <option key={el} value={el}>{el.charAt(0).toUpperCase() + el.slice(1)}</option>)}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : items.length === 0 ? (
        <EmptyState icon={<span style={{ fontSize: '2rem' }}>⚔️</span>} title="Nenhum item encontrado"
          description="O banco de dados ainda está sendo populado." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map(item => (
            <Card key={item.id} hover className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.05em' }}>{item.name}</span>
                    {item.element && <ElementBadge element={item.element} />}
                  </div>
                  <div className="flex gap-3 text-xs" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {item.damage && <span>Dano: <strong style={{ color: '#e57373' }}>{item.damage}</strong></span>}
                    {item.critical && <span>Crit: {item.critical}</span>}
                    {item.spaces && <span>{item.spaces} espaço{item.spaces !== 1 ? 's' : ''}</span>}
                  </div>
                </div>
                {item.curse_category && (
                  <span className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.25)', color: '#e57373', fontFamily: 'var(--font-display)', fontSize: '9px' }}>
                    CAT {item.curse_category}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArsenalPage;