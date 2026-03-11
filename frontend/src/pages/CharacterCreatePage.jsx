import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, Info } from 'lucide-react';
import { useCharacters, calculateDerived, attrIncreasesByNex } from '../hooks';
import { Button, Input, Card } from '../components/ui';

const CLASSES = [
  {
    value: 'combatente', label: 'Combatente', color: '#e57373',
    desc: 'Especialista em combate. Maior PV. Usa armas táticas e proteções leves.',
    pericias: 'Luta ou Pontaria + Fortitude ou Reflexos + 1+Int',
    pvInfo: '20+VIG | +4+VIG/NEX', peInfo: '2+PRE | +2+PRE/NEX',
    pdInfo: '6+PRE | +3+PRE/NEX', sanInfo: '12 | +3/NEX',
  },
  {
    value: 'especialista', label: 'Especialista', color: '#48cae4',
    desc: 'Versátil e habilidoso. Mais perícias. Equilíbrio entre combate e investigação.',
    pericias: '7+Int perícias à escolha',
    pvInfo: '16+VIG | +3+VIG/NEX', peInfo: '3+PRE | +3+PRE/NEX',
    pdInfo: '8+PRE | +4+PRE/NEX', sanInfo: '16 | +4/NEX',
  },
  {
    value: 'ocultista', label: 'Ocultista', color: '#a991f7',
    desc: 'Mestre dos rituais. Maior PE e Sanidade. Menor PV.',
    pericias: 'Ocultismo + Vontade + 3+Int à escolha',
    pvInfo: '12+VIG | +2+VIG/NEX', peInfo: '4+PRE | +4+PRE/NEX',
    pdInfo: '10+PRE | +5+PRE/NEX', sanInfo: '20 | +5/NEX',
  },
];

const TRILHAS = {
  combatente:   ['Aniquilador','Comandante de Campo','Guerreiro','Operações Especiais','Tropa de Choque','Médico de Campo'],
  especialista: ['Atirador de Elite','Infiltrador','Inventor','Protetor','Médico de Campo'],
  ocultista:    ['Conduíte','Flagelador','Graduado','Intuitivo','Lâmina Paranormal'],
};

const ORIGENS = [
  { v:'Acadêmico',              f:'LB',  p:'Ciências e Investigação',          b:'Mundos Distintos: +5 em Ciências e Ocultismo' },
  { v:'Agente de Saúde',        f:'LB',  p:'Medicina e Vontade',               b:'Cuidados Básicos: 1 PE → cura 1d6+PRE PV em aliado adjacente' },
  { v:'Amnésico',               f:'LB',  p:'Atletismo e Percepção',            b:'Instinto de Sobrevivência: 1×/cena, reroll num d20' },
  { v:'Artista',                f:'LB',  p:'Enganação e Percepção',            b:'Persona: +OO no primeiro teste social da cena' },
  { v:'Atleta',                 f:'LB',  p:'Atletismo e Acrobacia',            b:'Força Atlética: +2 em testes de Atletismo' },
  { v:'Chef',                   f:'LB',  p:'Fortitude e Investigação',         b:'Preparo Especial: interlúdio → +2 PV/PE/SAN no grupo' },
  { v:'Criminoso',              f:'LB',  p:'Crime e Enganação',                b:'Contatos Sombrios: acesso a informações ilegítimas' },
  { v:'Cultista Arrependido',   f:'LB',  p:'Enganação e Ocultismo',            b:'Conhecimento Proibido: 1 PE → +5 em Ocultismo' },
  { v:'Desgarrado',             f:'LB',  p:'Fortitude e Sobrevivência',        b:'Resiliência: +1 PV por 5% de NEX' },
  { v:'Engenheiro',             f:'LB',  p:'Ciências e Tecnologia',            b:'Adaptação: usa Intelecto em vez de Força em ações práticas' },
  { v:'Executivo',              f:'LB',  p:'Diplomacia e Intuição',            b:'Autoridade: usa PRE em vez de INT em testes sociais' },
  { v:'Investigador',           f:'LB',  p:'Investigação e Percepção',         b:'Rastrear: +OO em testes de Investigação' },
  { v:'Lutador',                f:'LB',  p:'Atletismo e Luta',                 b:'Combatente Nato: +2 em rolagens de dano corpo a corpo' },
  { v:'Magnata',                f:'LB',  p:'Diplomacia e Profissão',           b:'Recursos: acesso a itens cat. I sem custo de missão' },
  { v:'Militar',                f:'LB',  p:'Pontaria e Tática',                b:'Para Bellum: +2 em rolagens de dano com armas de fogo' },
  { v:'Operário',               f:'LB',  p:'Fortitude e Profissão',            b:'Trabalho Braçal: +2 em FOR para carregar, construir e demolir' },
  { v:'Policial',               f:'LB',  p:'Percepção e Pontaria',             b:'Patrulha: +2 em Defesa' },
  { v:'Religioso',              f:'LB',  p:'Religião e Vontade',               b:'Acalentar: +5 Religião para acalmar; aliado recupera 1d6+PRE SAN' },
  { v:'Servidor Público',       f:'LB',  p:'Intuição e Vontade',               b:'Espírito Cívico: ajuda → 2 PE para +2 no bônus concedido' },
  { v:'Teórico da Conspiração', f:'LB',  p:'Investigação e Ocultismo',         b:'Eu Já Sabia: resistência a dano mental = Intelecto' },
  { v:'Trabalhador Rural',      f:'LB',  p:'Adestramento e Sobrevivência',     b:'Desbravador: sem penalidade em terreno difícil; 2PE → +5 em Adestramento/Sobrevivência' },
  { v:'Trambiqueiro',           f:'LB',  p:'Crime e Enganação',                b:'Impostor: 1×/cena, 2 PE → substitui qualquer teste por Enganação' },
  { v:'T.I.',                   f:'LB',  p:'Investigação e Tecnologia',        b:'Motor de Busca: 2 PE + internet → substitui teste por Tecnologia' },
  { v:'Universitário',          f:'LB',  p:'Atualidades e Investigação',       b:'Dedicação: +1 PE + 1 PE por NEX ímpar; limite de PE/turno +1' },
  { v:'Vítima',                 f:'LB',  p:'Reflexos e Vontade',               b:'Cicatrizes Psicológicas: +1 SAN por 5% de NEX' },
  { v:'Ferido por Ritual',      f:'AS1', p:'Ocultismo + 1 pela escolha do elemento', b:'Mácula Ritualística: conjura 1 ritual de 1° círculo grátis 1×/cena; –O vs aquele elemento' },
  { v:'Transtornado Arrependido', f:'AS1', p:'Luta e Ocultismo',               b:'Sofrimento de Sangue: RD 2/mental (+1 por 2 rituais de Sangue); condição de descanso piorada' },
];

const TRAITS = [
  { key:'trait_brave',    label:'Corajoso'    },
  { key:'trait_curious',  label:'Curioso'     },
  { key:'trait_skeptic',  label:'Cético'      },
  { key:'trait_pragmatic',label:'Pragmático'  },
  { key:'trait_empath',   label:'Empático'    },
  { key:'trait_lone_wolf',label:'Solitário'   },
  { key:'trait_leader',   label:'Líder'       },
  { key:'trait_haunted',  label:'Assombrado'  },
];

const NEX_VALUES = [...Array(19).keys()].map(i => (i+1)*5).concat([99]);
const STEPS = ['Identidade','Atributos','Classe','Narrativa','Revisão'];
const ATTRS = ['agi','for','int','pre','vig'];
const ATTR_INFO = {
  agi:{ label:'AGI', name:'Agilidade',  desc:'Esquiva, pontaria, acrobacia, furtividade' },
  for:{ label:'FOR', name:'Força',      desc:'Luta, atletismo, dano corpo a corpo' },
  int:{ label:'INT', name:'Intelecto',  desc:'Ciências, medicina, ocultismo, rituais' },
  pre:{ label:'PRE', name:'Presença',   desc:'Diplomacia, intuição, PE, DT de efeitos' },
  vig:{ label:'VIG', name:'Vigor',      desc:'PV por NEX, fortitude, resistência' },
};

function TextArea({ label, value, onChange, placeholder, rows=4, hint }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label style={{fontFamily:'var(--font-display)',fontSize:'11px',letterSpacing:'0.1em',color:'var(--text-muted)'}}>{label}</label>}
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
        style={{background:'rgba(10,10,14,0.8)',border:'1px solid rgba(90,87,80,0.4)',borderRadius:'6px',
          color:'var(--text-primary)',padding:'8px 12px',fontSize:'0.875rem',fontFamily:'var(--font-body)',
          lineHeight:1.6,resize:'vertical',outline:'none',width:'100%'}}
        onFocus={e=>e.target.style.borderColor='rgba(192,57,43,0.5)'}
        onBlur={e=>e.target.style.borderColor='rgba(90,87,80,0.4)'}
      />
      {hint && <span style={{fontSize:'11px',color:'var(--text-muted)'}}>{hint}</span>}
    </div>
  );
}

function StatBox({ label, value, color='#e57373' }) {
  return (
    <div className="flex flex-col items-center py-3 rounded border border-stone-800 bg-stone-900/40">
      <span style={{fontFamily:'var(--font-display)',fontSize:'9px',letterSpacing:'0.12em',color:'var(--text-muted)'}}>{label}</span>
      <span style={{fontFamily:'var(--font-mono)',fontSize:'1.4rem',color}}>{value}</span>
    </div>
  );
}

export default function CharacterCreatePage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { createCharacter } = useCharacters();

  const [form, setForm] = useState({
    name:'', player_name:'', origin:'', nex:5,
    agi:1, for:1, int:1, pre:1, vig:1,
    class:'', subclass:'', use_pd:false,
    backstory:'', personality:'', appearance:'', motivations:'', connections:'', secrets:'', notes:'',
    trait_brave:false, trait_curious:false, trait_skeptic:false, trait_pragmatic:false,
    trait_empath:false, trait_lone_wolf:false, trait_leader:false, trait_haunted:false,
  });

  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const toggle = k => setForm(p=>({...p,[k]:!p[k]}));

  const nexBonuses = attrIncreasesByNex(form.nex);
  const totalPoints = 4 + nexBonuses;
  const attrSpent = ATTRS.reduce((s,k)=>s+(form[k]-1),0);
  const attrMaxPerAttr = Math.min(3+nexBonuses,5);

  const derived = form.class ? calculateDerived({
    class:form.class, nex:form.nex, use_pd:form.use_pd,
    agi:form.agi, for:form.for, int:form.int, pre:form.pre, vig:form.vig,
  }) : null;

  const selectedOrigin = ORIGENS.find(o=>o.v===form.origin);

  const canNext = () => {
    if(step===0) return form.name.trim().length>=2 && form.origin;
    if(step===1) return attrSpent<=totalPoints;
    if(step===2) return form.class && form.subclass;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      const char = await createCharacter({
        name:form.name, player_name:form.player_name, origin:form.origin, nex:form.nex,
        agi:form.agi, for_:form.for, int_:form.int, pre:form.pre, vig:form.vig,
        class:form.class, subclass:form.subclass, use_pd:form.use_pd,
        backstory:form.backstory, personality:form.personality, appearance:form.appearance,
        motivations:form.motivations, connections:form.connections, secrets:form.secrets,
        notes:form.notes,
      });
      navigate(`/characters/${char.id}`);
    } catch(err) {
      setError(err.response?.data?.error||'Erro ao criar ficha');
      setLoading(false);
    }
  };

  const clsConfig = CLASSES.find(c=>c.value===form.class);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <p style={{color:'var(--text-muted)',fontSize:'10px',fontFamily:'var(--font-display)',letterSpacing:'0.25em'}}>ORDO REALITAS — RECRUTAMENTO</p>
        <h1 style={{fontFamily:'var(--font-display)',letterSpacing:'0.08em'}}>Nova Ficha</h1>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label,i)=>(
          <React.Fragment key={label}>
            <div className={`flex items-center gap-1.5 ${i<step?'cursor-pointer':''}`} onClick={()=>i<step&&setStep(i)}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs border transition-all"
                style={{background:i<step?'rgba(192,57,43,0.25)':i===step?'rgba(192,57,43,0.12)':'transparent',
                  borderColor:i<=step?'#c0392b':'rgba(90,87,80,0.35)',
                  color:i<=step?'#e57373':'var(--text-muted)',fontFamily:'var(--font-display)',fontSize:'10px'}}>
                {i<step?<Check size={10}/>:i+1}
              </div>
              <span style={{fontFamily:'var(--font-display)',fontSize:'9px',letterSpacing:'0.1em',
                color:i===step?'var(--text-primary)':'var(--text-muted)'}}>
                {label.toUpperCase()}
              </span>
            </div>
            {i<STEPS.length-1&&<div className="flex-1 h-px" style={{background:i<step?'rgba(192,57,43,0.3)':'rgba(90,87,80,0.25)'}}/>}
          </React.Fragment>
        ))}
      </div>

      <Card className="p-6 mb-6">
        {error&&<div className="rounded border border-red-800/50 px-3 py-2 text-sm text-red-400 mb-4" style={{background:'rgba(192,57,43,0.08)'}}>{error}</div>}

        {/* ═══ IDENTIDADE ═══ */}
        {step===0&&(
          <div className="flex flex-col gap-5">
            <div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'1rem',letterSpacing:'0.08em'}}>Identidade do Agente</h2>
              <p style={{color:'var(--text-muted)',fontSize:'0.82rem',marginTop:'2px'}}>Quem é seu personagem e de onde ele vem?</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nome do personagem *" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Ex: Marcos Vieira"/>
              <Input label="Nome do jogador" value={form.player_name} onChange={e=>set('player_name',e.target.value)} placeholder="Seu nome"/>
            </div>
            <div>
              <label style={{fontFamily:'var(--font-display)',fontSize:'11px',letterSpacing:'0.1em',color:'var(--text-muted)'}}>ORIGEM *</label>
              <select value={form.origin} onChange={e=>set('origin',e.target.value)}
                style={{width:'100%',marginTop:'6px',background:'rgba(10,10,14,0.8)',border:'1px solid rgba(90,87,80,0.4)',
                  borderRadius:'6px',color:'var(--text-primary)',padding:'8px 12px',fontSize:'0.875rem',
                  fontFamily:'var(--font-body)',outline:'none'}}>
                <option value="">Selecione uma origem...</option>
                <optgroup label="── Livro Base ──">
                  {ORIGENS.filter(o=>o.f==='LB').map(o=><option key={o.v} value={o.v}>{o.v}</option>)}
                </optgroup>
                <optgroup label="── Arquivos Secretos #1 ──">
                  {ORIGENS.filter(o=>o.f==='AS1').map(o=><option key={o.v} value={o.v}>{o.v}</option>)}
                </optgroup>
              </select>
              {selectedOrigin&&(
                <div className="mt-2 rounded px-3 py-2 border" style={{background:'rgba(192,57,43,0.04)',borderColor:'rgba(192,57,43,0.2)'}}>
                  <p style={{fontSize:'12px',color:'var(--text-muted)',marginBottom:'3px'}}>
                    <span style={{color:'var(--text-secondary)'}}>Perícias:</span> {selectedOrigin.p}
                  </p>
                  <p style={{fontSize:'12px',color:'var(--text-muted)'}}>
                    <span style={{color:'var(--text-secondary)'}}>Poder:</span> {selectedOrigin.b}
                  </p>
                  {selectedOrigin.f!=='LB'&&(
                    <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-xs"
                      style={{background:'rgba(192,57,43,0.15)',color:'#e57373',fontFamily:'var(--font-display)',fontSize:'9px',letterSpacing:'0.08em'}}>
                      ARQUIVOS SECRETOS
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* NEX */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label style={{fontFamily:'var(--font-display)',fontSize:'11px',letterSpacing:'0.1em',color:'var(--text-muted)'}}>NEX INICIAL</label>
                <span style={{fontFamily:'var(--font-mono)',color:'#e57373'}}>{form.nex}%</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {NEX_VALUES.map(v=>(
                  <button key={v} onClick={()=>set('nex',v)}
                    className="px-2 py-0.5 rounded border transition-all"
                    style={{borderColor:form.nex===v?'#c0392b':'rgba(90,87,80,0.35)',
                      background:form.nex===v?'rgba(192,57,43,0.15)':'transparent',
                      color:v===99?(form.nex===v?'#a991f7':'rgba(169,145,247,0.5)'):(form.nex===v?'#e57373':'var(--text-muted)'),
                      fontFamily:'var(--font-mono)',fontSize:'11px'}}>
                    {v}%
                  </button>
                ))}
              </div>
              {form.nex===99&&<p className="mt-2 text-xs" style={{color:'#a991f7'}}>⚠ NEX 99% — personagem à beira do precipício. Use apenas com aprovação do Mestre.</p>}
              {nexBonuses>0&&<p className="mt-1 text-xs" style={{color:'var(--text-muted)'}}>Com NEX {form.nex}%, você tem {nexBonuses} aumento{nexBonuses>1?'s':''} de atributo acumulado{nexBonuses>1?'s':''}.</p>}
            </div>

            {/* PD */}
            <div className="rounded border p-4 transition-all" style={{borderColor:form.use_pd?'rgba(169,145,247,0.4)':'rgba(90,87,80,0.25)',background:form.use_pd?'rgba(169,145,247,0.05)':'transparent'}}>
              <div className="flex items-start gap-3">
                <button onClick={()=>toggle('use_pd')}
                  className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                  style={{borderColor:form.use_pd?'#a991f7':'rgba(90,87,80,0.5)',background:form.use_pd?'rgba(169,145,247,0.2)':'transparent'}}>
                  {form.use_pd&&<Check size={10} style={{color:'#a991f7'}}/>}
                </button>
                <div>
                  <p style={{fontFamily:'var(--font-display)',fontSize:'12px',color:form.use_pd?'#a991f7':'var(--text-primary)'}}>
                    Usar Pontos de Determinação (PD)
                    <span className="ml-2 px-1.5 py-0.5 rounded" style={{background:'rgba(169,145,247,0.12)',color:'#a991f7',fontFamily:'var(--font-display)',fontSize:'9px'}}>SOBREVIVENDO AO HORROR</span>
                  </p>
                  <p className="mt-1 text-xs" style={{color:'var(--text-muted)',lineHeight:1.5}}>
                    Regra opcional: PE e Sanidade são unificados em <strong style={{color:'var(--text-secondary)'}}>Pontos de Determinação</strong>. Habilidades e dano mental consomem PD. Mais simples e narrativo — ideal para sessões de terror.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ATRIBUTOS ═══ */}
        {step===1&&(
          <div className="flex flex-col gap-5">
            <div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'1rem',letterSpacing:'0.08em'}}>Distribuir Atributos</h2>
              <p style={{color:'var(--text-muted)',fontSize:'0.82rem',marginTop:'4px'}}>
                Todos começam em 1. Você tem <strong style={{color:'var(--text-primary)'}}>4 pontos</strong>{nexBonuses>0&&<> + <strong style={{color:'#e57373'}}>{nexBonuses} bônus NEX</strong></>}. Máx <strong style={{color:'var(--text-primary)'}}>{attrMaxPerAttr}</strong> por atributo. Pode zerar 1 atributo para ganhar +1 ponto.
              </p>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded border"
              style={{borderColor:attrSpent>totalPoints?'rgba(192,57,43,0.5)':'rgba(90,87,80,0.3)',background:'rgba(0,0,0,0.2)'}}>
              <span style={{fontFamily:'var(--font-display)',fontSize:'11px',letterSpacing:'0.1em',color:'var(--text-muted)'}}>PONTOS USADOS</span>
              <span style={{fontFamily:'var(--font-mono)',color:attrSpent>totalPoints?'#e57373':'#52b788',fontSize:'1.1rem'}}>{attrSpent}/{totalPoints}</span>
            </div>
            <div className="flex flex-col gap-2">
              {ATTRS.map(key=>{
                const {label,name,desc}=ATTR_INFO[key];
                return(
                  <div key={key} className="flex items-center gap-3 py-2 px-3 rounded border"
                    style={{borderColor:'rgba(90,87,80,0.2)',background:'rgba(0,0,0,0.12)'}}>
                    <div style={{minWidth:'110px'}}>
                      <span style={{fontFamily:'var(--font-display)',fontSize:'12px',color:'var(--text-primary)'}}>{label} </span>
                      <span style={{fontSize:'11px',color:'var(--text-muted)'}}>{name}</span>
                      <div style={{fontSize:'10px',color:'var(--text-muted)',marginTop:'1px'}}>{desc}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <button onClick={()=>form[key]>0&&set(key,form[key]-1)} disabled={form[key]<=0}
                        className="w-7 h-7 rounded border flex items-center justify-center"
                        style={{borderColor:'rgba(90,87,80,0.4)',color:'var(--text-muted)',fontSize:'18px',lineHeight:1}}>−</button>
                      <span style={{fontFamily:'var(--font-mono)',fontSize:'1.25rem',color:form[key]===0?'#e57373':'var(--text-primary)',minWidth:'20px',textAlign:'center'}}>{form[key]}</span>
                      <button onClick={()=>form[key]<attrMaxPerAttr&&attrSpent<totalPoints&&set(key,form[key]+1)}
                        disabled={form[key]>=attrMaxPerAttr||attrSpent>=totalPoints}
                        className="w-7 h-7 rounded border flex items-center justify-center"
                        style={{borderColor:'rgba(90,87,80,0.4)',color:'var(--text-muted)',fontSize:'18px',lineHeight:1}}>+</button>
                    </div>
                    <div className="flex gap-1 ml-2">
                      {[0,1,2,3,4].map(n=>(
                        <div key={n} className="w-2 h-2 rounded-full"
                          style={{background:n<form[key]?'#e57373':'rgba(90,87,80,0.35)'}}/>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ CLASSE ═══ */}
        {step===2&&(
          <div className="flex flex-col gap-5">
            <div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'1rem',letterSpacing:'0.08em'}}>Classe e Trilha</h2>
              <p style={{color:'var(--text-muted)',fontSize:'0.82rem',marginTop:'2px'}}>Seu treinamento dentro da Ordo Realitas.</p>
            </div>
            <div className="flex flex-col gap-3">
              {CLASSES.map(cls=>(
                <button key={cls.value} onClick={()=>{set('class',cls.value);set('subclass','');}}
                  className="p-4 rounded border text-left transition-all"
                  style={{background:form.class===cls.value?`${cls.color}08`:'transparent',borderColor:form.class===cls.value?cls.color:'rgba(90,87,80,0.35)'}}>
                  <div className="flex items-center justify-between mb-1">
                    <span style={{fontFamily:'var(--font-display)',fontSize:'14px',color:form.class===cls.value?cls.color:'var(--text-primary)'}}>{cls.label}</span>
                    {form.class===cls.value&&<Check size={14} style={{color:cls.color}}/>}
                  </div>
                  <p style={{fontSize:'12px',color:'var(--text-muted)'}}>{cls.desc}</p>
                  <p style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',marginTop:'3px'}}>{cls.pericias}</p>
                  {form.class===cls.value&&(
                    <div className="mt-3 pt-3 border-t flex flex-wrap gap-4" style={{borderColor:`${cls.color}20`}}>
                      {[['PV',cls.pvInfo],form.use_pd?['PD',cls.pdInfo]:['PE',cls.peInfo],...(!form.use_pd?[['SAN',cls.sanInfo]]:[])].map(([l,v])=>(
                        <div key={l}>
                          <div style={{fontSize:'9px',letterSpacing:'0.1em',color:'var(--text-muted)',fontFamily:'var(--font-display)'}}>{l}</div>
                          <div style={{fontSize:'11px',color:cls.color}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
            {form.class&&(
              <div>
                <label style={{fontFamily:'var(--font-display)',fontSize:'11px',letterSpacing:'0.1em',color:'var(--text-muted)'}}>TRILHA *</label>
                <div className="flex flex-col gap-2 mt-2">
                  {(TRILHAS[form.class]||[]).map(t=>(
                    <button key={t} onClick={()=>set('subclass',t)}
                      className="flex items-center gap-2 px-3 py-2 rounded border text-left transition-all"
                      style={{borderColor:form.subclass===t?(clsConfig?.color||'#e57373'):'rgba(90,87,80,0.3)',
                        background:form.subclass===t?'rgba(192,57,43,0.06)':'transparent',
                        color:form.subclass===t?'var(--text-primary)':'var(--text-muted)',fontSize:'13px'}}>
                      {form.subclass===t&&<Check size={12} style={{color:clsConfig?.color}}/>}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ NARRATIVA ═══ */}
        {step===3&&(
          <div className="flex flex-col gap-5">
            <div>
              <h2 style={{fontFamily:'var(--font-display)',fontSize:'1rem',letterSpacing:'0.08em'}}>Narrativa do Personagem</h2>
              <p style={{color:'var(--text-muted)',fontSize:'0.82rem',marginTop:'2px'}}>Todos os campos são opcionais — dão vida ao seu agente. Pode completar depois.</p>
            </div>
            <div>
              <label style={{fontFamily:'var(--font-display)',fontSize:'11px',letterSpacing:'0.1em',color:'var(--text-muted)'}}>TRAÇOS DE PERSONALIDADE</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {TRAITS.map(({key,label})=>(
                  <button key={key} onClick={()=>toggle(key)}
                    className="px-3 py-1 rounded border text-xs transition-all"
                    style={{borderColor:form[key]?'#c0392b':'rgba(90,87,80,0.35)',
                      background:form[key]?'rgba(192,57,43,0.12)':'transparent',
                      color:form[key]?'#e57373':'var(--text-muted)',
                      fontFamily:'var(--font-display)',letterSpacing:'0.06em'}}>
                    {form[key]&&'✓ '}{label}
                  </button>
                ))}
              </div>
            </div>
            <TextArea label="APARÊNCIA" value={form.appearance} onChange={e=>set('appearance',e.target.value)}
              placeholder="Como seu personagem se parece? O que chamaria atenção em você?" rows={2}/>
            <TextArea label="HISTÓRIA DE ORIGEM" value={form.backstory} onChange={e=>set('backstory',e.target.value)}
              placeholder="O que aconteceu antes de entrar na Ordem? Qual foi o evento que mudou sua vida? Que segredos você carrega do passado?"
              rows={5} hint="Conecte sua origem aos eventos que te trouxeram para o Outro Lado."/>
            <TextArea label="PERSONALIDADE & COMPORTAMENTO" value={form.personality} onChange={e=>set('personality',e.target.value)}
              placeholder="Como você age em investigações? E em combate? Quais são seus valores?" rows={3}/>
            <TextArea label="MOTIVAÇÕES" value={form.motivations} onChange={e=>set('motivations',e.target.value)}
              placeholder="Por que você continua na Ordem? O que te mantém em pé mesmo diante do horror?" rows={2}/>
            <div className="grid grid-cols-2 gap-4">
              <TextArea label="CONEXÕES" value={form.connections} onChange={e=>set('connections',e.target.value)}
                placeholder="Aliados, rivais, família, contatos..." rows={3}/>
              <TextArea label="SEGREDOS" value={form.secrets} onChange={e=>set('secrets',e.target.value)}
                placeholder="O que você esconde dos outros agentes?" rows={3}/>
            </div>
            <TextArea label="NOTAS DO JOGADOR" value={form.notes} onChange={e=>set('notes',e.target.value)}
              placeholder="Ideias para arcos, objetivos de roleplay, anotações livres..." rows={2}/>
          </div>
        )}

        {/* ═══ REVISÃO ═══ */}
        {step===4&&derived&&(
          <div className="flex flex-col gap-5">
            <h2 style={{fontFamily:'var(--font-display)',fontSize:'1rem',letterSpacing:'0.08em'}}>Revisar Ficha</h2>
            <div className="grid grid-cols-3 gap-3">
              {[['Nome',form.name],['Jogador',form.player_name||'—'],['NEX',`${form.nex}%`],['Origem',form.origin],['Classe',form.class],['Trilha',form.subclass]].map(([l,v])=>(
                <div key={l}>
                  <div style={{fontFamily:'var(--font-display)',fontSize:'9px',letterSpacing:'0.15em',color:'var(--text-muted)'}}>{l.toUpperCase()}</div>
                  <div style={{color:'var(--text-primary)',fontSize:'0.875rem',marginTop:'2px'}}>{v}</div>
                </div>
              ))}
            </div>
            {form.use_pd&&(
              <div className="px-3 py-2 rounded border" style={{borderColor:'rgba(169,145,247,0.3)',background:'rgba(169,145,247,0.05)'}}>
                <span style={{fontFamily:'var(--font-display)',fontSize:'11px',color:'#a991f7',letterSpacing:'0.08em'}}>◈ USANDO PONTOS DE DETERMINAÇÃO</span>
              </div>
            )}
            <div className="border-t border-stone-800 pt-4">
              <p style={{fontFamily:'var(--font-display)',fontSize:'10px',letterSpacing:'0.15em',color:'var(--text-muted)',marginBottom:'10px'}}>ATRIBUTOS</p>
              <div className="grid grid-cols-5 gap-2">
                {ATTRS.map(k=>(
                  <div key={k} className="flex flex-col items-center py-2 rounded border border-stone-800">
                    <span style={{fontFamily:'var(--font-display)',fontSize:'9px',color:'var(--text-muted)'}}>{ATTR_INFO[k].label}</span>
                    <span style={{fontFamily:'var(--font-mono)',fontSize:'1.3rem',color:'#e57373'}}>{form[k]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-stone-800 pt-4">
              <p style={{fontFamily:'var(--font-display)',fontSize:'10px',letterSpacing:'0.15em',color:'var(--text-muted)',marginBottom:'10px'}}>DERIVADAS</p>
              {form.use_pd?(
                <div className="grid grid-cols-3 gap-3">
                  <StatBox label="PV MÁX" value={derived.pvMax}/>
                  <StatBox label="PD MÁX" value={derived.pdMax} color="#a991f7"/>
                  <StatBox label="DEFESA" value={derived.defesa} color="#48cae4"/>
                </div>
              ):(
                <div className="grid grid-cols-4 gap-3">
                  <StatBox label="PV MÁX" value={derived.pvMax}/>
                  <StatBox label="PE MÁX" value={derived.peMax} color="#f0c040"/>
                  <StatBox label="SAN MÁX" value={derived.sanMax} color="#52b788"/>
                  <StatBox label="DEFESA" value={derived.defesa} color="#48cae4"/>
                </div>
              )}
              <p className="mt-3 text-xs" style={{color:'var(--text-muted)'}}>Limite de {form.use_pd?'PD':'PE'} por turno: <strong style={{color:'var(--text-secondary)'}}>{derived.peLimit}</strong></p>
            </div>
            {TRAITS.filter(t=>form[t.key]).length>0&&(
              <div className="border-t border-stone-800 pt-4">
                <p style={{fontFamily:'var(--font-display)',fontSize:'10px',letterSpacing:'0.15em',color:'var(--text-muted)',marginBottom:'8px'}}>TRAÇOS</p>
                <div className="flex flex-wrap gap-1.5">
                  {TRAITS.filter(t=>form[t.key]).map(({label})=>(
                    <span key={label} className="px-2 py-0.5 rounded text-xs"
                      style={{background:'rgba(192,57,43,0.1)',border:'1px solid rgba(192,57,43,0.25)',color:'#e57373',fontFamily:'var(--font-display)',fontSize:'10px'}}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(form.backstory||form.personality)&&(
              <div className="border-t border-stone-800 pt-4">
                <p style={{fontFamily:'var(--font-display)',fontSize:'10px',letterSpacing:'0.15em',color:'var(--text-muted)',marginBottom:'8px'}}>NARRATIVA</p>
                {form.backstory&&<p className="text-xs" style={{color:'var(--text-muted)',lineHeight:1.6,marginBottom:'4px'}}><strong style={{color:'var(--text-secondary)'}}>Origem:</strong> {form.backstory.slice(0,150)}{form.backstory.length>150?'…':''}</p>}
                {form.personality&&<p className="text-xs" style={{color:'var(--text-muted)',lineHeight:1.6}}><strong style={{color:'var(--text-secondary)'}}>Personalidade:</strong> {form.personality.slice(0,100)}{form.personality.length>100?'…':''}</p>}
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={()=>setStep(s=>s-1)} disabled={step===0}><ChevronLeft size={14}/> Voltar</Button>
        {step<STEPS.length-1?(
          <Button onClick={()=>setStep(s=>s+1)} disabled={!canNext()}>{step===3?'Revisar Ficha':'Próximo'} <ChevronRight size={14}/></Button>
        ):(
          <Button onClick={handleSubmit} loading={loading} disabled={!canNext()}><Check size={14}/> Criar Ficha</Button>
        )}
      </div>
    </div>
  );
}