import React, { useState } from 'react';
import { Dice6, RefreshCw, Users } from 'lucide-react';
import { Button, Card } from '../components/ui';

// Tabelas do livro base
const MISSION_TABLES = {
  sujeito: ['Um culto local','A Ordo Realitas','Uma corporação','Um político corrupto','Uma família tradicional','Um grupo de cientistas','Uma organização criminosa','Um líder religioso','Um grupo de estudantes','Uma celebridade'],
  acao: ['está investigando','está encobrindo','está invocando','está caçando','foi infectado por','está protegendo','desapareceu por causa de','está vendendo','está criando','foi corrompido por'],
  local: ['um hospital abandonado','uma escola pública','um shopping center','uma fazenda isolada','o metrô da cidade','uma mansão antiga','uma fábrica desativada','o porto da cidade','uma universidade','um condomínio fechado'],
  aliado: ['um detetive particular','uma médica forense','um hacker adolescente','uma jornalista investigativa','um ex-militar','uma vidente local','um padre renegado','uma cientista excêntrica','um informante da polícia','um ladrão reformado'],
  complicacao: ['mas o tempo está acabando','e não podem ser vistos','mas os civis estão em risco','e há um traidor no grupo','mas a mídia está de olho','e o paranormal está instável','mas alguém já sabe demais','e a Ordem está monitorando','mas os recursos são escassos','e nem tudo é o que parece'],
};

const TRANSTORNADO_PERFIS = ['Desesperado','Quebrado','Ambicioso','Obcecado','Convertido','Fanático','Perdido','Vingativo','Inocente Corrompido','Herdeiro do Culto'];
const TRANSTORNADO_TRACOS = ['tem cicatrizes rituais no corpo','fala em voz baixa demais','sorri na hora errada','carrega uma relíquia de Sangue','nunca olha nos olhos','recita orações ao Diabo','tem um talismã costurado na pele','tem medo de espelhos','coleciona fotos de vítimas','acredita ser abençoado'];

const MEDO_TABELA = [
  { roll: '2', effect: 'Catatônico: fica imóvel e em silêncio por 1d4 rodadas.' },
  { roll: '3-4', effect: 'Fuga: usa seu próximo turno para se afastar da fonte do medo.' },
  { roll: '5-6', effect: 'Trêmulo: fica com a condição Abalado até o fim da cena.' },
  { roll: '7-8', effect: 'Grito: grita e delata a posição do grupo.' },
  { roll: '9-10', effect: 'Paralisado: perde a próxima ação.' },
  { roll: '11-12', effect: 'Medo profundo: fica com a condição Apavorado até o fim da cena.' },
  { roll: '13-14', effect: 'Reação violenta: ataca o aliado mais próximo.' },
  { roll: '15-16', effect: 'Colapso: cai no chão e fica com Morrendo (1 PV).' },
  { roll: '17-18', effect: 'Trauma: perde 1d6 SAN permanentemente.' },
  { roll: '19-20', effect: 'Enlouquecido: o mestre controla o personagem por 1d4 rodadas.' },
];

function roll(max) { return Math.floor(Math.random() * max); }
function rollD6() { return Math.floor(Math.random() * 6) + 1; }
function rollD10() { return Math.floor(Math.random() * 10) + 1; }
function pick(arr) { return arr[roll(arr.length)]; }

export default function GmToolsPage() {
  const [mission, setMission] = useState(null);
  const [npc, setNpc] = useState(null);
  const [fearRoll, setFearRoll] = useState(null);
  const [vdInput, setVdInput] = useState('');
  const [vdResult, setVdResult] = useState(null);
  const [nexInputs, setNexInputs] = useState(['5']);

  const generateMission = () => {
    setMission({
      sujeito: pick(MISSION_TABLES.sujeito),
      acao: pick(MISSION_TABLES.acao),
      local: pick(MISSION_TABLES.local),
      aliado: pick(MISSION_TABLES.aliado),
      complicacao: pick(MISSION_TABLES.complicacao),
    });
  };

  const generateNpc = () => {
    const tracos = [];
    while (tracos.length < 2) {
      const t = pick(TRANSTORNADO_TRACOS);
      if (!tracos.includes(t)) tracos.push(t);
    }
    setNpc({ perfil: pick(TRANSTORNADO_PERFIS), traco1: tracos[0], traco2: tracos[1] });
  };

  const rollFear = () => {
    const r = rollD10() + rollD10();
    const entry = MEDO_TABELA.find(e => {
      const parts = e.roll.split('-');
      if (parts.length === 1) return parseInt(parts[0]) === r;
      return r >= parseInt(parts[0]) && r <= parseInt(parts[1]);
    });
    setFearRoll({ value: r, effect: entry?.effect || '?' });
  };

  const calcVD = () => {
    const nexValues = nexInputs.map(n => parseInt(n) || 5).filter(n => n > 0);
    if (nexValues.length === 0) return;
    const totalNex = nexValues.reduce((a, b) => a + b, 0);
    const avgNex = totalNex / nexValues.length;
    setVdResult({
      easy:     Math.round(avgNex * 0.5 * nexValues.length),
      medium:   Math.round(avgNex * 0.8 * nexValues.length),
      hard:     Math.round(avgNex * 1.2 * nexValues.length),
      deadly:   Math.round(avgNex * 1.8 * nexValues.length),
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-display)', letterSpacing: '0.25em' }}>ORDO REALITAS — OPERAÇÕES</p>
        <h1 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>Mesa do Mestre</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Geradores, calculadoras e tabelas para facilitar a narração.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Gerador de Missão */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.08em' }}>Gerador de Missão</h3>
            <Button size="sm" onClick={generateMission}><RefreshCw size={12} /> Gerar</Button>
          </div>
          {mission ? (
            <div className="p-3 rounded border border-stone-800 bg-stone-900/40">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{mission.sujeito}</strong>{' '}
                {mission.acao}{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{mission.local}</strong>.{' '}
                O aliado mais provável é{' '}
                <strong style={{ color: '#48cae4' }}>{mission.aliado}</strong>,{' '}
                <em style={{ color: 'var(--text-muted)' }}>{mission.complicacao}</em>.
              </p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Clique em Gerar para criar um gancho de missão aleatório.</p>
          )}
        </Card>

        {/* Gerador de NPC Transtornado */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.08em' }}>Gerador de Transtornado</h3>
            <Button size="sm" onClick={generateNpc}><RefreshCw size={12} /> Gerar</Button>
          </div>
          {npc ? (
            <div className="p-3 rounded border border-stone-800 bg-stone-900/40">
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.1em', color: '#e57373', marginBottom: '6px' }}>
                PERFIL: {npc.perfil.toUpperCase()}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Este Transtornado <em>{npc.traco1}</em> e <em>{npc.traco2}</em>.
              </p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Gera perfil e traços de um membro dos Transtornados.</p>
          )}
        </Card>

        {/* Calculadora de VD */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.08em' }}>Calculadora de VD</h3>
            <Button size="sm" onClick={calcVD}><Dice6 size={12} /> Calcular</Button>
          </div>
          <div className="mb-3">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '8px' }}>
              NEX DOS JOGADORES
            </p>
            <div className="flex flex-wrap gap-2">
              {nexInputs.map((v, i) => (
                <input key={i} type="number" value={v} min="5" max="99"
                  onChange={e => { const n = [...nexInputs]; n[i] = e.target.value; setNexInputs(n); }}
                  className="w-16 bg-stone-900/80 border border-stone-700 text-stone-200 rounded px-2 py-1.5 text-sm text-center focus:outline-none focus:border-stone-500"
                  style={{ fontFamily: 'var(--font-mono)' }} />
              ))}
              <button onClick={() => setNexInputs([...nexInputs, '5'])}
                className="w-8 h-8 rounded border border-dashed border-stone-700 text-stone-500 hover:border-stone-500 hover:text-stone-300 transition-all flex items-center justify-center">+</button>
              {nexInputs.length > 1 && (
                <button onClick={() => setNexInputs(nexInputs.slice(0,-1))}
                  className="w-8 h-8 rounded border border-dashed border-stone-700 text-stone-500 hover:border-red-700 hover:text-red-400 transition-all flex items-center justify-center">−</button>
              )}
            </div>
          </div>
          {vdResult && (
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Fácil', value: vdResult.easy, color: '#52b788' },
                { label: 'Médio', value: vdResult.medium, color: '#f0c040' },
                { label: 'Difícil', value: vdResult.hard, color: '#e57373' },
                { label: 'Mortal', value: vdResult.deadly, color: '#a991f7' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center p-2 rounded border border-stone-800 bg-stone-900/30">
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{label.toUpperCase()}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color, fontSize: '1.1rem' }}>VD {value}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Tabela de Medo */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.08em' }}>Tabela de Medo (2d10)</h3>
            <Button size="sm" onClick={rollFear}><Dice6 size={12} /> Rolar</Button>
          </div>
          {fearRoll ? (
            <div className="p-3 rounded border border-stone-800 bg-stone-900/40">
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#e57373', marginBottom: '6px' }}>{fearRoll.value}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{fearRoll.effect}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {MEDO_TABELA.map(entry => (
                <div key={entry.roll} className="flex gap-3 text-xs py-1 border-b border-stone-800/40 last:border-0">
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#e57373', minWidth: '32px' }}>{entry.roll}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{entry.effect}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}