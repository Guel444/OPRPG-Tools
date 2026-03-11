import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, User, ChevronRight } from 'lucide-react';
import { useCharacters } from '../hooks';
import { Button, Card, ResourceBar, EmptyState, Spinner } from '../components/ui';

const CLASS_COLORS = {
  combatente:   { color: '#e57373', label: 'Combatente' },
  especialista: { color: '#48cae4', label: 'Especialista' },
  ocultista:    { color: '#a991f7', label: 'Ocultista' },
  sobrevivente: { color: '#52b788', label: 'Sobrevivente' },
};

export default function CharactersPage() {
  const { characters, loading, deleteCharacter } = useCharacters();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-display)', letterSpacing: '0.25em' }}>
            ORDO REALITAS — AGENTES
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>Fichas de Personagem</h1>
        </div>
        <Link to="/characters/new">
          <Button size="md">
            <Plus size={14} />
            Nova Ficha
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : characters.length === 0 ? (
        <EmptyState
          icon={<User size={40} />}
          title="Nenhuma ficha criada"
          description="Crie sua primeira ficha de personagem para começar."
          action={
            <Link to="/characters/new">
              <Button><Plus size={14} /> Criar Ficha</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {characters.map(char => {
            const cls = CLASS_COLORS[char.class] || { color: '#9e9a8e', label: char.class };
            return (
              <Link key={char.id} to={`/characters/${char.id}`}>
                <Card hover glow className="p-5">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded border flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cls.color}15`, borderColor: `${cls.color}30` }}>
                      <User size={18} style={{ color: cls.color }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', letterSpacing: '0.05em' }}>
                          {char.name}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded"
                          style={{ background: `${cls.color}15`, border: `1px solid ${cls.color}30`, color: cls.color, fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.1em' }}>
                          {cls.label.toUpperCase()}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                          NEX {char.nex}%
                        </span>
                      </div>

                      {/* Barras de recurso */}
                      <div className="grid grid-cols-3 gap-3 max-w-xs">
                        <ResourceBar label="PV" current={char.pv_atual} max={char.pv_max} color="#e57373" />
                        <ResourceBar label="PE" current={char.pe_atual} max={char.pe_max} color="#a991f7" />
                        <ResourceBar label="SAN" current={char.san_atual} max={char.san_max} color="#48cae4" />
                      </div>
                    </div>

                    <ChevronRight size={16} className="text-stone-600 flex-shrink-0" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}