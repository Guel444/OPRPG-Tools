import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useCatalog } from '../hooks';
import { Card, Select, EmptyState, Spinner } from '../components/ui';

const POWER_TYPES = [
  { value: 'geral',               label: 'Geral' },
  { value: 'combatente',          label: 'Combatente' },
  { value: 'especialista',        label: 'Especialista' },
  { value: 'ocultista',           label: 'Ocultista' },
  { value: 'sobrevivente',        label: 'Sobrevivente' },
  { value: 'paranormal_sangue',   label: 'Paranormal — Sangue' },
  { value: 'paranormal_morte',    label: 'Paranormal — Morte' },
  { value: 'paranormal_conhecimento', label: 'Paranormal — Conhecimento' },
  { value: 'paranormal_energia',  label: 'Paranormal — Energia' },
  { value: 'paranormal_medo',     label: 'Paranormal — Medo' },
  { value: 'intencao',            label: 'Intenção' },
];

const TYPE_COLORS = {
  geral: '#9e9a8e', combatente: '#e57373', especialista: '#48cae4',
  ocultista: '#a991f7', sobrevivente: '#52b788',
  paranormal_sangue: '#c0392b', paranormal_morte: '#6c5ce7',
  paranormal_conhecimento: '#d4a017', paranormal_energia: '#00b4d8',
  paranormal_medo: '#2d6a4f', intencao: '#f0f0f0',
};

export default function PowersPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [nex, setNex] = useState('');
  const [expanded, setExpanded] = useState(null);

  const params = {};
  if (search) params.search = search;
  if (type) params.type = type;
  if (nex) params.nex = nex;

  const { data: powers, loading } = useCatalog('powers', params);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-display)', letterSpacing: '0.25em' }}>ORDO REALITAS — CAPACIDADES</p>
        <h1 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>Poderes</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Todos os poderes gerais, de classe, paranormais e de Intenção.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar poder..."
            className="w-full bg-stone-900/80 border border-stone-700 text-stone-200 rounded px-3 py-2.5 pl-9 text-sm focus:outline-none focus:border-stone-500"
            style={{ fontFamily: 'var(--font-body)' }} />
        </div>
        <Select value={type} onChange={e => setType(e.target.value)} className="w-52">
          <option value="">Tipo</option>
          {POWER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </Select>
        <Select value={nex} onChange={e => setNex(e.target.value)} className="w-36">
          <option value="">NEX máx.</option>
          {[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,99].map(n => (
            <option key={n} value={n}>até {n}%</option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : powers.length === 0 ? (
        <EmptyState icon={<span style={{ fontSize: '2rem' }}>✨</span>} title="Nenhum poder encontrado"
          description="O banco de dados ainda está sendo populado." />
      ) : (
        <div className="flex flex-col gap-2">
          {powers.map(power => {
            const color = TYPE_COLORS[power.power_type] || '#9e9a8e';
            return (
              <Card key={power.id} hover className="overflow-hidden">
                <button className="w-full p-4 text-left" onClick={() => setExpanded(expanded === power.id ? null : power.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.05em' }}>{power.name}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: `${color}15`, border: `1px solid ${color}30`, color, fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.08em' }}>
                          {POWER_TYPES.find(t => t.value === power.power_type)?.label || power.power_type}
                        </span>
                        {power.nex_required > 5 && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                            NEX {power.nex_required}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
                {expanded === power.id && (
                  <PowerDetail slug={power.slug} />
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PowerDetail({ slug }) {
  const { data, loading } = useCatalogItem('powers', slug);
  if (loading) return <div className="px-4 pb-4"><Spinner size={20} /></div>;
  if (!data) return null;
  return (
    <div className="px-4 pb-4 border-t border-stone-800/60 pt-3">
      {data.prerequisites?.length > 0 && (
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
          Pré-requisitos: {data.prerequisites.map(p => typeof p === 'string' ? p : `${p.atributo?.toUpperCase()} ${p.valor}`).join(', ')}
        </p>
      )}
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>{data.description}</p>
      {data.affinity_description && (
        <div className="mt-3 p-3 rounded border border-stone-800 bg-stone-900/30">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.1em', color: '#f0c040', marginBottom: '4px' }}>AFINIDADE</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{data.affinity_description}</p>
        </div>
      )}
    </div>
  );
}

function useCatalogItem(endpoint, slug) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (!slug) return;
    import('axios').then(({ default: axios }) => {
      const API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      axios.get(`${API}/catalog/${endpoint}/${slug}`)
        .then(r => setData(r.data))
        .finally(() => setLoading(false));
    });
  }, [endpoint, slug]);
  return { data, loading };
}