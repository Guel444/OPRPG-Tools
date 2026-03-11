import React, { useState } from 'react';
import { FileText, ChevronRight, ChevronDown, BookOpen, Shield, Zap, Users, Skull } from 'lucide-react';
import { Card } from '../components/ui';

const PACKAGES = [
  {
    id: 'jan',
    number: '#1',
    title: 'Agatha & Os Transtornados',
    date: 'Janeiro 2025',
    color: '#c0392b',
    summary: 'Desvende o passado de Agatha Volkomenn e conheça o culto dos Transtornados — sua história, fichas e como usá-los em sua campanha.',
    sections: [
      {
        id: 'agatha-lore',
        icon: BookOpen,
        title: 'A História de Agatha',
        content: `Agatha Volkomenn cresceu em isolamento social, refugiando-se na biblioteca da escola. Ao descobrir uma passagem secreta que levava a um bunker de rituais, ela encontrou corpos de colegas e a evidência de que o diretor estava realizando rituais de Sangue. Encurralada e injustamente acusada, Agatha realizou seu primeiro ritual involuntariamente — mostrando a um garoto a verdade através dos olhos dela. Esse ato marcou o início de sua vida como ocultista.

A personalidade de Agatha é marcada por um cinismo protetor e uma profunda lealdade àqueles que ela considera verdadeiros amigos. Ela raramente demonstra emoções abertamente, mas age de forma decisiva quando as pessoas que se importa estão em perigo.

Sua habilidade mais conhecida é a Visão Compartilhada — um ritual de Conhecimento que permite que outra pessoa veja o mundo pelos seus olhos, literalmente.`,
        tags: ['Conto de Origem', 'Ocultista', 'Sangue', 'Conhecimento'],
      },
      {
        id: 'transtornados-lore',
        icon: Users,
        title: 'Os Transtornados',
        content: `Os Transtornados são um culto dedicado ao elemento Sangue. Eles acreditam que a dor e o sofrimento são caminhos para transcendência — que através da carne dilacerada e do sangue derramado, é possível tocar o Outro Lado de forma mais intensa do que qualquer outro método.

**Estrutura do Culto:** Os Transtornados não possuem uma hierarquia rígida. Em vez disso, são organizados em células autônomas que seguem os Apóstolos do Sangue — figuras lendárias que teriam alcançado um estado de comunhão quase total com a entidade de Sangue.

**Motivações:** Cada membro tem sua própria razão para integrar o culto — alguns buscam poder, outros escapam de traumas, muitos simplesmente foram corrompidos gradualmente por exposição ao elemento Sangue.

**Em Combate:** Os Transtornados são previsíveis em sua imprevisibilidade. Eles não temem a morte da mesma forma que mortais normais, o que os torna adversários extremamente perigosos — dispostos a sacrifícios que outros não considerariam.`,
        tags: ['Culto', 'Sangue', 'Apóstolos', 'Células'],
      },
      {
        id: 'hexatombe-npcs',
        icon: Skull,
        title: 'NPCs do Hexatombe',
        content: `**Carrara** — Um Transtornado de meia-idade com pregos cravados ao redor do crânio, pescoço e braços. Seu sangue é amaldiçoado pela entidade de Sangue, tornando qualquer munição banhada nele mais letal. Foi morto durante invasão ao apartamento de Kemi.
*PV: 70 | Defesa: 18 | Dano: 1d4+10 (soco) ou 3d4+10+1d6 Sangue (pregador pneumático)*

**Nando Salles** — "Criptobro" que vendia cursos e apostava em lutas ilegais. Carregava o Estigma da Coroa de Espinhos. Tentou matar o sacrifício rival com um tiro pelas costas — e pagou o preço. Sua habilidade *Arrogância Diabólica* forçava alvos a ações imprudentes.
*PV: 35 | Defesa: 16 | Habilidade: Arrogância Diabólica (Vontade DT 25)*`,
        tags: ['NPCs', 'Hexatombe', 'Fichas', 'Transtornados'],
      },
      {
        id: 'mission-hooks',
        icon: FileText,
        title: 'Ganchos de Missão',
        content: `**Choro do Asfalto** — Manchas vermelhas surgem no asfalto de um bairro periférico, acompanhadas de choros e sussurros. Crianças falam com o "homem do lado de dentro". Uma célula dos Transtornados se fixou nos esgotos, convertendo o trauma coletivo de uma chacina encoberta em combustível ritualístico.

**Ciência Diabólica** — Assassinatos em uma cidade universitária: vítimas com cortes ritualísticos e espinhos ósseos crescendo de seus corpos. Um grupo secreto realiza experimentos ocultistas com material biológico do Outro Lado.

**Jaula Aberta** — Um zoológico fecha as portas após um ataque interno. Os animais "aprenderam a falar com alguma coisa". Imagens vazadas mostram um hipopótamo arrancando a própria pele. Suspeita-se de um Apóstolo do Sangue manifestado.

**Sangue da Salvação** — Um culto de autoajuda ganha popularidade em São Paulo. Líderes Transtornados planejam usar uma transmissão ao vivo para reunir poder e conjurar um ritual de evolução coletiva.

**Hospital Vermelho** — Um hospital abandonado voltou a consumir energia elétrica. Técnicos enviados desaparecem. Drones perdem o sinal ao se aproximar. Moradores ouvem cânticos e gritos à noite.`,
        tags: ['Missões', 'Ganchos', 'Mestre', 'Horror'],
      },
      {
        id: 'new-rules',
        icon: Zap,
        title: 'Ritos & Maldições — Novas Regras',
        content: `**Novas Origens:**

*Ferido por Ritual* — Você sofreu os efeitos de um ritual (Sangue, Morte, Conhecimento ou Energia). Perícias: Ocultismo + 1 pelo elemento. Poder: *Mácula Ritualística* — aprende 1 ritual de 1° círculo que pode conjurar grátis 1×/cena. Contrapeso: –O contra efeitos daquele elemento.

*Transtornado Arrependido* — Você caminhou entre os Transtornados. Perícias: Luta e Ocultismo. Poder: *Sofrimento de Sangue* — RD 2/mental, aumentando +1 por cada 2 rituais/poderes de Sangue. Contrapeso: condição de descanso sempre 1 categoria pior.

**Novo Uso de Ocultismo:**
*Blindar a Mente (Veterano, DT 20)* — Gaste uma ação completa e 1 PE para focar no que sabe do paranormal, recebendo +5 no próximo teste de Vontade até o fim da cena. Pode usar em aliado adjacente (DT 25), mas o aliado faz Vontade DT 20 ou fica assustado e perde 1d4 SAN.

**Novos Poderes de Ocultista:**
- *Acostumado à Maldição de [Elemento]* — Ao falhar no preço de itens amaldiçoados do elemento escolhido, não perde SAN. Pré-req: Int 2, ritual 2° círculo do elemento.
- *Ritual Intenso* — Soma Presença nas rolagens de dano e cura de rituais. Pré-req: Pre 2.
- *Saúde Sobrenatural* — 1×/cena, ação de movimento e 3 PE → PV temporários = PRE × 10. Pré-req: Int 2, Pre 2, ritual 1° círculo.
- *Reter Ritual de Combate* — Quando um ritual com duração retida afeta negativamente um alvo que sai da linha de efeito, muda a duração para cena como reação.`,
        tags: ['Origens', 'Poderes', 'Regras Novas', 'Ocultista'],
      },
    ],
  },
  {
    id: 'fev',
    number: '#2',
    title: 'Os Mascarados',
    date: 'Fevereiro 2025',
    color: '#6c5ce7',
    summary: 'Conteúdo sobre a equipe dos Mascarados, incluindo fichas de NPCs, poderes e ganchos de missão.',
    sections: [
      {
        id: 'mascarados-lore',
        icon: Users,
        title: 'Os Mascarados',
        content: `Os Mascarados são um grupo misterioso que opera com identidades ocultas — literalmente. Cada membro usa uma máscara que representa sua função e personalidade dentro do grupo.

Ao contrário dos Transtornados, que abraçam o caos e a dor de forma visceral, os Mascarados operam com uma frieza calculada. Eles são planejadores, estrategistas, e raramente agem sem considerar os ângulos políticos e paranormais de uma situação.

**Filosofia:** Os Mascarados acreditam que a identidade é uma fraqueza. Ao suprimir o ego e adotar uma persona definida pelo papel que desempenha, um agente se torna mais eficiente — menos suscetível a manipulações emocionais e mais dedicado ao objetivo maior.`,
        tags: ['Mascarados', 'Lore', 'Hexatombe'],
      },
      {
        id: 'mascarados-missions',
        icon: FileText,
        title: 'Ganchos de Missão',
        content: `**O Arquivo Perdido** — Documentos classificados da Ordo Realitas foram roubados por alguém usando uma máscara veneziana. Os agentes devem rastrear o ladrão antes que informações sobre localização de manifestações paranormais caiam em mãos erradas.

**A Última Máscara** — Uma série de assassinatos tem como alvo ex-membros dos Mascarados que abandonaram o grupo. O assassino deixa uma máscara partida ao lado de cada corpo. Os agentes descobrem que alguém está "limpando a casa".

**Reunião de Máscaras** — Informantes relatam uma reunião secreta dos Mascarados em uma mansão abandonada. Os agentes são enviados para infiltrar o evento — mas para isso precisarão criar suas próprias máscaras e identidades.`,
        tags: ['Missões', 'Mascarados', 'Investigação'],
      },
    ],
    comingSoon: false,
  },
];

export default function SecretFilesPage() {
  const [activePackage, setActivePackage] = useState('jan');
  const [expandedSection, setExpandedSection] = useState(null);

  const pkg = PACKAGES.find(p => p.id === activePackage);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <p style={{ color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'var(--font-display)', letterSpacing: '0.25em' }}>
          ORDO REALITAS — DOCUMENTOS CLASSIFICADOS
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>Arquivos Secretos</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '4px' }}>
          Conteúdo oficial dos suplementos mensais — lore, fichas, regras e ganchos de missão. Tudo gratuito.
        </p>
      </div>

      {/* Seletor de pacote */}
      <div className="flex gap-3 mb-8 overflow-x-auto">
        {PACKAGES.map(p => (
          <button key={p.id} onClick={() => { setActivePackage(p.id); setExpandedSection(null); }}
            className="flex-shrink-0 px-4 py-3 rounded border transition-all text-left"
            style={{
              borderColor: activePackage === p.id ? p.color : 'rgba(90,87,80,0.35)',
              background: activePackage === p.id ? `${p.color}10` : 'transparent',
              minWidth: '160px',
            }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.15em', color: activePackage === p.id ? p.color : 'var(--text-muted)' }}>
              PACOTE {p.number}
            </div>
            <div style={{ color: activePackage === p.id ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>{p.title}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{p.date}</div>
          </button>
        ))}
      </div>

      {pkg && (
        <>
          {/* Resumo */}
          <div className="rounded border p-4 mb-6" style={{ borderColor: `${pkg.color}30`, background: `${pkg.color}06` }}>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} style={{ color: pkg.color }} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '11px', letterSpacing: '0.1em', color: pkg.color }}>
                SOBRE ESTE PACOTE
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{pkg.summary}</p>
          </div>

          {/* Seções */}
          <div className="flex flex-col gap-3">
            {pkg.sections.map(section => {
              const Icon = section.icon;
              const isOpen = expandedSection === section.id;
              return (
                <Card key={section.id} className="overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(isOpen ? null : section.id)}
                    className="w-full p-4 flex items-center gap-3 text-left transition-colors"
                    style={{ background: isOpen ? `${pkg.color}06` : 'transparent' }}>
                    <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: `${pkg.color}15`, border: `1px solid ${pkg.color}30` }}>
                      <Icon size={16} style={{ color: pkg.color }} />
                    </div>
                    <div className="flex-1">
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                        {section.title}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {section.tags.map(tag => (
                          <span key={tag} className="px-1.5 py-0.5 rounded"
                            style={{ background: `${pkg.color}12`, color: pkg.color, fontFamily: 'var(--font-display)', fontSize: '9px', letterSpacing: '0.07em' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isOpen ? <ChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> : <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 border-t" style={{ borderColor: 'rgba(90,87,80,0.2)' }}>
                      <div className="mt-4" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                        {section.content.split('\n').map((line, i) => {
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return <p key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.05em', color: 'var(--text-primary)', marginTop: i > 0 ? '16px' : '0', marginBottom: '4px' }}>{line.replace(/\*\*/g,'')}</p>;
                          }
                          if (line.startsWith('*') && line.endsWith('*')) {
                            return <p key={i} style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '8px' }}>{line.replace(/\*/g,'')}</p>;
                          }
                          if (line.startsWith('- ')) {
                            return <p key={i} style={{ color: 'var(--text-muted)', paddingLeft: '12px', borderLeft: `2px solid ${pkg.color}30`, marginBottom: '6px' }}>{line.slice(2)}</p>;
                          }
                          return line ? <p key={i} style={{ marginBottom: '8px' }}>{line}</p> : <div key={i} style={{ height: '4px' }} />;
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}