import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useCatalog, usePagination } from '../hooks';
import { fuzzySearch } from '../utils/fuzzySearch';
import { ElementBadge, VDBadge, Input, Select, EmptyState, Spinner, Card, Pagination } from '../components/ui';

const ELEMENTS = ['sangue','morte','conhecimento','energia','medo'];
const TYPES = ['criatura','animal','pessoa','ameaça'];
const SOURCES = [
  { value: 'livro_base', label: 'Livro Base' },
  { value: 'sah', label: 'Sobrevivendo ao Horror' },
  { value: 'as_jan', label: 'Arquivos Secretos - Jan' },
  { value: 'as_fev', label: 'Arquivos Secretos - Fev' },
];

export default function BestiaryPage() {
  const [search, setSearch] = useState('');
  const [element, setElement] = useState('');
  const [type, setType] = useState('');
  const [source, setSource] = useState('');
  const [minVD, setMinVD] = useState('');
  const [maxVD, setMaxVD] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const params = {};
  if (element) params.element = element;
  if (type) params.type = type;
  if (source) params.source = source;
  if (minVD) params.min_vd = minVD;
  if (maxVD) params.max_vd = maxVD;

  const { data: allCreatures, loading } = useCatalog('creatures', params);

  const filteredCreatures = useMemo(() => {
    if (!search.trim()) return allCreatures;
    return fuzzySearch(search, allCreatures, ['name', 'creature_type']);
  }, [search, allCreatures]);

  const { currentPage, totalPages, currentItems, goToPage } = usePagination(filteredCreatures, 12);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-display)', letterSpacing: '0.25em' }}>
          ORDO REALITAS — CLASSIFICADOS
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>Bestiário</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Catálogo completo de entidades do Outro Lado e ameaças da Realidade.
        </p>
      </div>

      {/* Busca e filtros */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <label htmlFor="creature-search" className="sr-only">Buscar criatura</label>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" aria-hidden="true" />
            <input
              id="creature-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar criatura..."
              className="w-full bg-stone-900/80 border border-stone-700 text-stone-200 rounded px-3 py-2.5 pl-9 text-sm focus:outline-none focus:border-stone-500 transition-all"
              style={{ fontFamily: 'var(--font-body)' }}
              aria-label="Buscar criatura por nome ou tipo"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
            className={`flex items-center gap-2 px-4 py-2.5 rounded border text-sm transition-all ${showFilters ? 'border-red-700 text-red-400 bg-red-900/10' : 'border-stone-700 text-stone-400 hover:border-stone-500'}`}
            style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.1em' }}
            title="Abrir painel de filtros"
          >
            <Filter size={14} aria-hidden="true" />
            FILTROS
          </button>
        </div>

        {showFilters && (
          <div id="filter-panel" className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded border border-stone-800 bg-stone-900/40" role="region" aria-label="Filtros de busca">
            <Select label="Elemento" value={element} onChange={e => setElement(e.target.value)}>
              <option value="">Todos</option>
              {ELEMENTS.map(el => <option key={el} value={el}>{el.charAt(0).toUpperCase() + el.slice(1)}</option>)}
            </Select>
            <Select label="Tipo" value={type} onChange={e => setType(e.target.value)}>
              <option value="">Todos</option>
              {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </Select>
            <Select label="Fonte" value={source} onChange={e => setSource(e.target.value)}>
              <option value="">Todas</option>
              {SOURCES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
            <div className="flex gap-2">
              <Input label="VD mín." type="number" value={minVD} onChange={e => setMinVD(e.target.value)} placeholder="0" />
              <Input label="VD máx." type="number" value={maxVD} onChange={e => setMaxVD(e.target.value)} placeholder="999" />
            </div>
          </div>
        )}
      </div>

      {/* Resultado */}
      {loading ? (
        <div className="flex justify-center py-20" role="status" aria-label="Carregando bestiário">
          <Spinner size={32} />
        </div>
      ) : filteredCreatures.length === 0 ? (
        <EmptyState
          icon={<span style={{ fontSize: '2rem' }}>👁️</span>}
          title="Nenhuma criatura encontrada"
          description="Tente ajustar os filtros de busca."
        />
      ) : (
        <>
          <div className="text-xs text-stone-600 mb-3" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }} role="status">
            {filteredCreatures.length} AMEAÇA{filteredCreatures.length !== 1 ? 'S' : ''} ENCONTRADA{filteredCreatures.length !== 1 ? 'S' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="main" aria-label="Lista de criaturas">
            {currentItems.map(creature => (
              <Link key={creature.id} to={`/bestiary/${creature.slug}`}>
                <Card hover glow className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="truncate" style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.05em' }}>
                          {creature.name}
                        </h3>
                        {creature.is_secret && (
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.25)', color: '#e57373', fontFamily: 'var(--font-display)', fontSize: '8px', letterSpacing: '0.1em' }} title="Apenas para assinantes">
                            ARQUIVO SECRETO
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <ElementBadge element={creature.element} />
                        <span className="text-xs text-stone-600" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                          {creature.size && creature.size.toUpperCase()} {creature.creature_type && `· ${creature.creature_type.toUpperCase()}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <VDBadge vd={creature.vd} />
                      {creature.pv && (
                        <span className="text-xs text-stone-500" style={{ fontFamily: 'var(--font-mono)' }}>
                          {creature.pv} PV
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
          )}
        </>
      )}
    </div>
  );
}