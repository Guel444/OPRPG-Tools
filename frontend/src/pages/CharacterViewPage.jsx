import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Trash2, Edit3, Check, X, ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useCharacters } from '../hooks';
import { Button, Card, StatGrid, ResourceBar, Spinner } from '../components/ui';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const CLASS_LABELS = { combatente: 'Combatente', especialista: 'Especialista', ocultista: 'Ocultista', sobrevivente: 'Sobrevivente' };
const CLASS_COLORS = { combatente: '#e57373', especialista: '#48cae4', ocultista: '#a991f7', sobrevivente: '#52b788' };

const CONDITIONS_LIST = [
  'Abalado','Agarrado','Alquebrado','Apavorado','Cego','Confuso','Enredado',
  'Envenenado','Esmorecido','Exausto','Fatigado','Frustrado','Imóvel',
  'Inconsciente','Indefeso','Lento','Machucado','Morrendo','Surdo','Vulnerável'
];

// Controle de recurso com botões +1/+5/-1/-5 e input manual
function ResourceControl({ label, field, maxField, current, max, color, onUpdate, readOnly }) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');

  const pct = max > 0 ? Math.round((current / max) * 100) : 0;

  const apply = (delta) => onUpdate(field, delta);

  const commitEdit = () => {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n)) {
      const clamped = Math.max(0, Math.min(max, n));
      onUpdate(field, clamped - current);
    }
    setEditing(false);
  };

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Label + valor */}
      <div className="flex items-baseline gap-1.5">
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>{label}</span>
        {editing ? (
          <input
            autoFocus
            type="number"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditing(false); }}
            style={{
              width: '52px', background: 'rgba(0,0,0,0.5)', border: `1px solid ${color}60`,
              borderRadius: '4px', color, fontFamily: 'var(--font-mono)', fontSize: '1.1rem',
              textAlign: 'center', outline: 'none', padding: '0 4px',
            }}
          />
        ) : (
          <span
            onClick={() => { if (!readOnly) { setInputVal(String(current)); setEditing(true); } }}
            title={readOnly ? '' : 'Clique para editar'}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '1.35rem', color,
              cursor: readOnly ? 'default' : 'pointer',
              borderBottom: readOnly ? 'none' : `1px dashed ${color}50`,
            }}>
            {current}
          </span>
        )}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ {max}</span>
      </div>

      {/* Barra */}
      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: pct <= 25 ? '#e57373' : pct <= 50 ? '#f0c040' : color }} />
      </div>

      {/* Botões */}
      {!readOnly && (
        <div className="flex items-center gap-1">
          {/* −5 */}
          <button onClick={() => apply(-5)}
            className="flex items-center justify-center rounded border transition-all"
            style={{ width: '28px', height: '22px', borderColor: 'rgba(90,87,80,0.4)', color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e5737380'; e.currentTarget.style.color = '#e57373'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(90,87,80,0.4)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            −5
          </button>
          {/* −1 */}
          <button onClick={() => apply(-1)}
            className="flex items-center justify-center rounded border transition-all"
            style={{ width: '24px', height: '24px', borderColor: 'rgba(90,87,80,0.4)', color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e5737380'; e.currentTarget.style.color = '#e57373'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(90,87,80,0.4)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            −
          </button>
          {/* +1 */}
          <button onClick={() => apply(1)}
            className="flex items-center justify-center rounded border transition-all"
            style={{ width: '24px', height: '24px', borderColor: 'rgba(90,87,80,0.4)', color: 'var(--text-muted)', fontSize: '16px', lineHeight: 1 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#52b78880'; e.currentTarget.style.color = '#52b788'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(90,87,80,0.4)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            +
          </button>
          {/* +5 */}
          <button onClick={() => apply(5)}
            className="flex items-center justify-center rounded border transition-all"
            style={{ width: '28px', height: '22px', borderColor: 'rgba(90,87,80,0.4)', color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#52b78880'; e.currentTarget.style.color = '#52b788'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(90,87,80,0.4)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
            +5
          </button>
        </div>
      )}
    </div>
  );
}

export default function CharacterViewPage({ shared }) {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const { updateCharacter, deleteCharacter } = useCharacters();
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [showNarrative, setShowNarrative] = useState(false);

  useEffect(() => {
    const url = shared
      ? `${API}/characters/share/${token}`
      : `${API}/characters/${id}`;
    axios.get(url)
      .then(r => { setChar(r.data); setNotes(r.data.notes || ''); })
      .catch(() => navigate('/characters'))
      .finally(() => setLoading(false));
  }, [id, token, shared, navigate]);

  const updateResource = async (field, delta) => {
    const maxField = field === 'pv_atual' ? 'pv_max'
      : field === 'pe_atual' ? 'pe_max'
      : field === 'san_atual' ? 'san_max'
      : field === 'pd_atual' ? 'pd_max'
      : field.replace('atual', 'max');
    const newVal = Math.max(0, Math.min(char[maxField], (char[field] || 0) + delta));
    const updated = await updateCharacter(char.id, { [field]: newVal });
    setChar(updated);
  };

  const toggleCondition = async (cond) => {
    const conditions = char.conditions || [];
    const next = conditions.includes(cond) ? conditions.filter(c => c !== cond) : [...conditions, cond];
    const updated = await updateCharacter(char.id, { conditions: next });
    setChar(updated);
  };

  const saveNotes = async () => {
    setSaving(true);
    const updated = await updateCharacter(char.id, { notes });
    setChar(updated);
    setSaving(false);
    setEditingNotes(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Deletar a ficha de ${char.name}? Esta ação não pode ser desfeita.`)) return;
    await deleteCharacter(char.id);
    navigate('/characters');
  };

  const handleShare = () => {
    const url = `${window.location.origin}/characters/share/${char.share_token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>;
  if (!char) return null;

  const color = CLASS_COLORS[char.class] || '#9e9a8e';
  const conditions = char.conditions || [];
  const usePd = char.use_pd;

  // Recursos a exibir dependendo do sistema escolhido
  const resources = usePd
    ? [
        { label: 'PV',  field: 'pv_atual',  maxField: 'pv_max',  color: '#e57373' },
        { label: 'PD',  field: 'pd_atual',  maxField: 'pd_max',  color: '#a991f7' },
      ]
    : [
        { label: 'PV',  field: 'pv_atual',  maxField: 'pv_max',  color: '#e57373' },
        { label: 'PE',  field: 'pe_atual',  maxField: 'pe_max',  color: '#f0c040' },
        { label: 'SAN', field: 'san_atual', maxField: 'san_max', color: '#52b788' },
      ];

  const hasNarrative = char.backstory || char.personality || char.appearance || char.motivations || char.connections || char.secrets;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/characters" className="text-stone-500 hover:text-stone-300 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.05em' }}>{char.name}</h1>
            <span className="px-2 py-0.5 rounded text-xs"
              style={{ background: `${color}15`, border: `1px solid ${color}30`, color, fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.1em' }}>
              {CLASS_LABELS[char.class]?.toUpperCase()}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '12px' }}>NEX {char.nex}%</span>
            {usePd && (
              <span className="px-2 py-0.5 rounded text-xs"
                style={{ background: 'rgba(169,145,247,0.1)', border: '1px solid rgba(169,145,247,0.25)', color: '#a991f7', fontFamily: 'var(--font-display)', fontSize: '9px' }}>
                PONTOS DE DETERMINAÇÃO
              </span>
            )}
          </div>
          {char.origin && (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              {char.origin}{char.subclass ? ` · ${char.subclass}` : ''}
              {char.player_name ? ` · ${char.player_name}` : ''}
            </p>
          )}
        </div>
        {!shared && (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 size={13} /> {copied ? 'Copiado!' : 'Compartilhar'}
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <Trash2 size={13} />
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Coluna esquerda */}
        <div className="md:col-span-2 flex flex-col gap-4">

          {/* Recursos */}
          <Card className="p-5">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '20px' }}>RECURSOS</p>
            <div className={`grid gap-6 ${resources.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {resources.map(({ label, field, maxField, color: c }) => (
                <ResourceControl
                  key={field}
                  label={label}
                  field={field}
                  maxField={maxField}
                  current={char[field] ?? char[maxField] ?? 0}
                  max={char[maxField] ?? 0}
                  color={c}
                  onUpdate={updateResource}
                  readOnly={!!shared}
                />
              ))}
            </div>
            {usePd && (
              <p className="mt-4 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                PD unifica PE e Sanidade — habilidades e dano mental consomem da mesma reserva.
              </p>
            )}
          </Card>

          {/* Atributos */}
          <Card className="p-5">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '12px' }}>ATRIBUTOS</p>
            <StatGrid agi={char.agi} for={char.for_} int={char.int_} pre={char.pre} vig={char.vig} />
            <div className="mt-3 flex gap-4 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span>Defesa: <strong style={{ color: 'var(--text-primary)' }}>{char.defesa || (10 + (char.agi || 0))}</strong></span>
              <span>{usePd ? 'PD' : 'PE'}/turno: <strong style={{ color: 'var(--text-primary)' }}>{Math.floor(char.nex / 5)}</strong></span>
            </div>
          </Card>

          {/* Condições */}
          <Card className="p-5">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '12px' }}>CONDIÇÕES ATIVAS</p>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS_LIST.map(cond => {
                const active = conditions.includes(cond);
                return (
                  <button key={cond} onClick={() => !shared && toggleCondition(cond)}
                    className={`px-2.5 py-1 rounded text-xs transition-all ${shared ? 'cursor-default' : 'cursor-pointer'}`}
                    style={{
                      fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.05em',
                      background: active ? 'rgba(231,76,60,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${active ? 'rgba(231,76,60,0.4)' : 'rgba(255,255,255,0.07)'}`,
                      color: active ? '#e57373' : 'var(--text-muted)',
                    }}>
                    {cond}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Narrativa */}
          {hasNarrative && (
            <Card className="overflow-hidden">
              <button
                onClick={() => setShowNarrative(v => !v)}
                className="w-full p-5 flex items-center justify-between text-left">
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>NARRATIVA</p>
                {showNarrative ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
              </button>
              {showNarrative && (
                <div className="px-5 pb-5 border-t border-stone-800/60 flex flex-col gap-4 pt-4">
                  {[
                    { key: 'appearance',  label: 'APARÊNCIA' },
                    { key: 'backstory',   label: 'HISTÓRIA DE ORIGEM' },
                    { key: 'personality', label: 'PERSONALIDADE' },
                    { key: 'motivations', label: 'MOTIVAÇÕES' },
                    { key: 'connections', label: 'CONEXÕES' },
                    { key: 'secrets',     label: 'SEGREDOS' },
                  ].filter(({ key }) => char[key]).map(({ key, label }) => (
                    <div key={key}>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{char[key]}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Anotações */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>ANOTAÇÕES</p>
              {!shared && !editingNotes && (
                <button onClick={() => setEditingNotes(true)} className="text-stone-500 hover:text-stone-300 transition-colors">
                  <Edit3 size={14} />
                </button>
              )}
            </div>
            {editingNotes ? (
              <div className="flex flex-col gap-2">
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={5}
                  className="w-full bg-stone-900/80 border border-stone-700 rounded px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-stone-500 resize-none"
                  style={{ fontFamily: 'var(--font-body)' }} />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingNotes(false); setNotes(char.notes || ''); }}>
                    <X size={13} /> Cancelar
                  </Button>
                  <Button size="sm" loading={saving} onClick={saveNotes}>
                    <Check size={13} /> Salvar
                  </Button>
                </div>
              </div>
            ) : (
              <p style={{ color: notes ? 'var(--text-secondary)' : 'var(--text-muted)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                {notes || 'Nenhuma anotação. Clique no ícone para editar.'}
              </p>
            )}
          </Card>
        </div>

        {/* Coluna direita */}
        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '12px' }}>INFORMAÇÕES</p>
            <div className="flex flex-col gap-3 text-sm">
              {char.player_name && (
                <div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', display: 'block' }}>JOGADOR</span>
                  <span style={{ color: 'var(--text-primary)' }}>{char.player_name}</span>
                </div>
              )}
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', display: 'block' }}>PRESTÍGIO</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{char.prestige || 0}</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', display: 'block' }}>SISTEMA</span>
                <span style={{ color: usePd ? '#a991f7' : 'var(--text-primary)', fontSize: '12px' }}>
                  {usePd ? 'Pontos de Determinação' : 'PE + Sanidade'}
                </span>
              </div>
            </div>
          </Card>

          {/* Traços */}
          {(() => {
            const traitMap = {
              trait_brave: 'Corajoso', trait_curious: 'Curioso', trait_skeptic: 'Cético',
              trait_pragmatic: 'Pragmático', trait_empath: 'Empático', trait_lone_wolf: 'Solitário',
              trait_leader: 'Líder', trait_haunted: 'Assombrado',
            };
            const activeTraits = Object.entries(traitMap).filter(([k]) => char[k]);
            if (!activeTraits.length) return null;
            return (
              <Card className="p-4">
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '10px' }}>TRAÇOS</p>
                <div className="flex flex-wrap gap-1.5">
                  {activeTraits.map(([, label]) => (
                    <span key={label} className="px-2 py-0.5 rounded text-xs"
                      style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.25)', color: '#e57373', fontFamily: 'var(--font-display)', fontSize: '10px' }}>
                      {label}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })()}

          <Card className="p-4">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '8px' }}>PODERES</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Em breve: gestão de poderes na ficha.</p>
          </Card>
          <Card className="p-4">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '8px' }}>RITUAIS</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Em breve: gestão de rituais na ficha.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}