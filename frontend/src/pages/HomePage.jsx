import React from 'react';
import { Link } from 'react-router-dom';
import { User, Skull, Scroll, Swords, Wand2, Package, FileText, Heart, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';

const MODULES = [
  {
    path: '/characters',
    label: 'Fichas de Personagem',
    icon: User,
    description: 'Crie e gerencie personagens com cálculo automático de PV, PE/PD, SAN. Backstory, traços e narrativa completa.',
    color: '#e57373',
    tags: ['Combatente', 'Especialista', 'Ocultista', 'Pontos de Determinação'],
  },
  {
    path: '/bestiary',
    label: 'Bestiário',
    icon: Skull,
    description: 'Catálogo completo de criaturas com filtros por elemento, VD e fonte.',
    color: '#a991f7',
    tags: ['50+ criaturas', 'Livro Base', 'SaH', 'Arquivos Secretos'],
  },
  {
    path: '/rituals',
    label: 'Rituais',
    icon: Scroll,
    description: 'Todos os rituais organizados por elemento e círculo, com versões Discente e Verdadeiro.',
    color: '#f0c040',
    tags: ['1º ao 4º círculo', '5 elementos', 'Multi-elemento'],
  },
  {
    path: '/arsenal',
    label: 'Arsenal',
    icon: Swords,
    description: 'Armas, proteções, itens gerais, paranormais e amaldiçoados de todos os suplementos.',
    color: '#48cae4',
    tags: ['Armas', 'Proteções', 'Itens Amaldiçoados'],
  },
  {
    path: '/powers',
    label: 'Poderes',
    icon: Wand2,
    description: 'Todos os poderes gerais, de classe e paranormais filtrados por NEX, tipo e fonte.',
    color: '#52b788',
    tags: ['Livro Base', 'SaH', 'Arquivos Secretos', 'Paranormal'],
  },
  {
    path: '/gm-tools',
    label: 'Mesa do Mestre',
    icon: Package,
    description: 'Geradores de missões e NPCs, calculadora de VD e tracker de sessão.',
    color: '#9e9a8e',
    tags: ['Gerador de Missão', 'NPCs', 'Calculadora VD'],
  },
  {
    path: '/secret-files',
    label: 'Arquivos Secretos',
    icon: FileText,
    description: 'Conteúdo oficial dos suplementos mensais: Agatha, Transtornados, Hexatombe, Mascarados e muito mais.',
    color: '#c0392b',
    tags: ['Janeiro', 'Fevereiro', 'Origens', 'Poderes', 'NPCs'],
  },
];

const ELEMENT_COLORS = {
  Sangue: '#c0392b', Morte: '#6c5ce7', Conhecimento: '#d4a017', Energia: '#00b4d8', Medo: '#2d6a4f'
};

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="mb-12 pt-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(192,57,43,0.4))' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--text-muted)' }}>
            ORDO REALITAS
          </span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(192,57,43,0.4))' }} />
        </div>
        <h1 className="text-center mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '0.1em' }}>
          Ferramentas para<br />
          <span style={{ color: '#e57373' }}>Ordem Paranormal RPG</span>
        </h1>
        <p className="text-center max-w-lg mx-auto" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '1.05rem' }}>
          Fichas automáticas, bestiário completo, catálogo de rituais, Arquivos Secretos e ferramentas para o Mestre. Tudo gratuito.
        </p>

        <div className="flex justify-center gap-3 mt-6">
          {Object.entries(ELEMENT_COLORS).map(([name, color]) => (
            <span key={name} className="px-2.5 py-1 rounded text-xs uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-display)', color, background: `${color}15`, border: `1px solid ${color}30`, fontSize: '9px' }}>
              {name}
            </span>
          ))}
        </div>

        {!user && (
          <div className="flex justify-center gap-3 mt-8">
            <Link to="/register"><Button size="lg">Criar Conta</Button></Link>
            <Link to="/login"><Button variant="secondary" size="lg">Entrar</Button></Link>
          </div>
        )}
      </div>

      {/* Grid de módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map(({ path, label, icon: Icon, description, color, tags }) => (
          <Link key={path} to={path}
            className="group rounded border border-stone-800/80 p-5 flex flex-col gap-3 transition-all duration-200"
            style={{ background: 'rgba(22,22,26,0.8)', backdropFilter: 'blur(4px)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.boxShadow = `0 0 20px ${color}10`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.boxShadow = ''; }}>
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <ChevronRight size={14} className="text-stone-700 group-hover:text-stone-400 transition-colors mt-1" />
            </div>
            <div>
              <h3 className="mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                {label}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>{description}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
              {tags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 rounded text-xs"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                    color: 'var(--text-muted)', fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.07em' }}>
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {/* Botão de Apoio */}
      <div className="mt-10 rounded border p-6 text-center" style={{ borderColor: 'rgba(192,57,43,0.2)', background: 'rgba(192,57,43,0.04)' }}>
        <Heart size={20} style={{ color: '#e57373', margin: '0 auto 8px' }} />
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: '6px' }}>
          Este site é gratuito e sempre será
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 16px' }}>
          Desenvolvido por fãs, para fãs. Se quiser apoiar o projeto e manter o servidor no ar, qualquer contribuição é bem-vinda — mas nunca obrigatória.
        </p>
        <a href="https://apoia.se" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded border transition-all"
          style={{ borderColor: 'rgba(192,57,43,0.4)', background: 'rgba(192,57,43,0.1)', color: '#e57373',
            fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.08em', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,57,43,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(192,57,43,0.1)'}>
          <Heart size={14} /> Apoiar o Projeto
        </a>
      </div>

      {/* Footer stats */}
      <div className="mt-10 pt-6 border-t border-stone-800/40 flex flex-wrap justify-center gap-8">
        {[
          { value: '50+',  label: 'Criaturas' },
          { value: '80+',  label: 'Rituais' },
          { value: '3',    label: 'Classes' },
          { value: '27+',  label: 'Origens' },
          { value: '5',    label: 'Elementos' },
          { value: '100%', label: 'Gratuito' },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#e57373', letterSpacing: '0.05em' }}>{value}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}