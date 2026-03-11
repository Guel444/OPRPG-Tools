import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Skull } from "lucide-react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const ELEMENT_THEME = {
  sangue: {
    label: "Sangue", color: "#c0392b", glow: "#e74c3c",
    bg: "radial-gradient(ellipse at 30% 20%, rgba(192,57,43,0.35) 0%, rgba(10,0,0,0.97) 60%)",
    border: "rgba(192,57,43,0.5)", accent: "#ff6b6b", particle: "🩸", icon: "💉",
    pattern: "repeating-linear-gradient(45deg, rgba(192,57,43,0.04) 0px, rgba(192,57,43,0.04) 1px, transparent 1px, transparent 12px)",
  },
  morte: {
    label: "Morte", color: "#6c5ce7", glow: "#a29bfe",
    bg: "radial-gradient(ellipse at 70% 10%, rgba(108,92,231,0.3) 0%, rgba(5,5,15,0.98) 60%)",
    border: "rgba(108,92,231,0.5)", accent: "#b2a0ff", particle: "💀", icon: "☠️",
    pattern: "repeating-linear-gradient(-45deg, rgba(108,92,231,0.04) 0px, rgba(108,92,231,0.04) 1px, transparent 1px, transparent 14px)",
  },
  conhecimento: {
    label: "Conhecimento", color: "#0984e3", glow: "#74b9ff",
    bg: "radial-gradient(ellipse at 50% 0%, rgba(9,132,227,0.3) 0%, rgba(0,5,20,0.98) 60%)",
    border: "rgba(9,132,227,0.5)", accent: "#74b9ff", particle: "🔮", icon: "🧠",
    pattern: "radial-gradient(circle at 25px 25px, rgba(9,132,227,0.06) 2px, transparent 2px)",
  },
  energia: {
    label: "Energia", color: "#fdcb6e", glow: "#ffeaa7",
    bg: "radial-gradient(ellipse at 80% 30%, rgba(253,203,110,0.2) 0%, rgba(5,10,5,0.98) 60%)",
    border: "rgba(253,203,110,0.45)", accent: "#ffeaa7", particle: "⚡", icon: "⚡",
    pattern: "repeating-linear-gradient(90deg, rgba(253,203,110,0.03) 0px, rgba(253,203,110,0.03) 1px, transparent 1px, transparent 20px)",
  },
  medo: {
    label: "Medo", color: "#00b894", glow: "#55efc4",
    bg: "radial-gradient(ellipse at 20% 80%, rgba(0,184,148,0.25) 0%, rgba(0,8,12,0.98) 60%)",
    border: "rgba(0,184,148,0.45)", accent: "#55efc4", particle: "👁️", icon: "😱",
    pattern: "radial-gradient(ellipse at 50px 50px, rgba(0,184,148,0.05) 10px, transparent 10px)",
  },
};

const SIZE_LABELS = {
  minúsculo: "Minúsculo", pequeno: "Pequeno", médio: "Médio", média: "Médio",
  grande: "Grande", enorme: "Enorme", colossal: "Colossal",
};

const SOURCE_LABELS = {
  LB: "Livro Base", SaH: "Sobrevivendo ao Horror",
  AS1: "Arquivos Secretos #1", AS2: "Arquivos Secretos #2",
};

function CreatureArtwork({ creature, theme }) {
  const [imgError, setImgError] = useState(false);
  if (creature.image_url && !imgError) {
    return (
      <img src={creature.image_url} alt={creature.name}
        onError={() => setImgError(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
    );
  }
  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: `radial-gradient(ellipse at center, ${theme.color}22 0%, transparent 70%)`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: theme.pattern, backgroundSize: "30px 30px", opacity: 0.8 }} />
      <div style={{ fontSize: "96px", filter: `drop-shadow(0 0 30px ${theme.glow})`, animation: "crPulse 3s ease-in-out infinite", position: "relative", zIndex: 1 }}>
        {theme.icon}
      </div>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "0.3em", color: theme.color, opacity: 0.5, marginTop: "16px", textTransform: "uppercase", position: "relative", zIndex: 1 }}>
        Arte não disponível
      </div>
      <div style={{ position: "absolute", width: "200px", height: "200px", borderRadius: "50%", border: `1px solid ${theme.color}33`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", border: `1px solid ${theme.color}18`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
    </div>
  );
}

function StatBox({ label, value, color, small }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: small ? "8px 10px" : "12px 14px",
      background: "rgba(255,255,255,0.04)", border: `1px solid ${color}33`,
      borderRadius: "6px", minWidth: small ? "56px" : "64px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div style={{ fontSize: small ? "17px" : "22px", fontWeight: "700", color, fontFamily: "'Cinzel',serif", lineHeight: 1 }}>
        {value ?? "—"}
      </div>
      <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>
        {label}
      </div>
    </div>
  );
}

function AbilityCard({ ability, theme }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{
      background: open ? `${theme.color}18` : "rgba(255,255,255,0.03)",
      border: `1px solid ${open ? theme.border : "rgba(255,255,255,0.08)"}`,
      borderRadius: "8px", padding: "12px 16px", cursor: "pointer", transition: "all 0.2s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: theme.accent, flexShrink: 0, boxShadow: `0 0 6px ${theme.accent}` }} />
        <span style={{ fontSize: "14px", fontWeight: "600", color: "rgba(255,255,255,0.9)", fontFamily: "'Cinzel',serif", flex: 1 }}>
          {ability.nome}
        </span>
        <span style={{ fontSize: "10px", color: theme.color, opacity: 0.7 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${theme.color}22`, fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: "1.6" }}>
          {ability.desc}
        </div>
      )}
    </div>
  );
}

export default function CreaturePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [creature, setCreature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/catalog/creatures/${slug}`)
      .then(r => { if (!r.ok) throw new Error("Criatura não encontrada"); return r.json(); })
      .then(setCreature)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cinzel',serif", color: "rgba(255,255,255,0.3)", fontSize: "14px", letterSpacing: "0.3em" }}>
      CARREGANDO...
    </div>
  );

  if (error || !creature) return (
    <div style={{ minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
      <Skull size={48} color="#666" />
      <div style={{ color: "#666", fontFamily: "'Cinzel',serif" }}>{error || "Criatura não encontrada"}</div>
      <button onClick={() => navigate("/bestiary")} style={{ background: "none", border: "1px solid #333", color: "#888", padding: "8px 20px", borderRadius: "4px", cursor: "pointer", fontFamily: "'Cinzel',serif", fontSize: "12px", letterSpacing: "0.15em" }}>
        VOLTAR AO BESTIÁRIO
      </button>
    </div>
  );

  const el = creature.element?.toLowerCase() || "morte";
  const theme = ELEMENT_THEME[el] || ELEMENT_THEME.morte;
  const parse = v => v ? (typeof v === "string" ? JSON.parse(v) : v) : (Array.isArray(v) ? [] : {});
  const abilities = parse(creature.abilities) || [];
  const resistances = parse(creature.resistances) || {};
  const vulnerabilities = parse(creature.vulnerabilities) || [];
  const immunities = parse(creature.immunities) || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        @keyframes crPulse { 0%,100%{transform:scale(1);opacity:.9;} 50%{transform:scale(1.05);opacity:1;} }
        @keyframes crGlow { 0%,100%{box-shadow:0 0 20px ${theme.color}44;} 50%{box-shadow:0 0 45px ${theme.color}77,0 0 60px ${theme.color}22;} }
        @keyframes crScan { 0%{transform:translateY(-100%);} 100%{transform:translateY(100vh);} }
        @keyframes crFade { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
        .cr-artwork{animation:crGlow 4s ease-in-out infinite;}
        .cr-main{animation:crFade 0.5s ease forwards;}
      `}</style>
      <div style={{ minHeight: "100vh", background: "#060608", color: "#e8e6e0", fontFamily: "'Crimson Pro',Georgia,serif", position: "relative", overflow: "hidden" }}>
        {/* Backgrounds */}
        <div style={{ position: "fixed", inset: 0, background: theme.bg, pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "fixed", inset: 0, background: theme.pattern, backgroundSize: "30px 30px", pointerEvents: "none", zIndex: 0, opacity: 0.6 }} />
        <div style={{ position: "fixed", left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${theme.color}22, transparent)`, animation: "crScan 8s linear infinite", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "0 20px 60px" }}>

          {/* Nav */}
          <div style={{ padding: "24px 0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${theme.color}22` }}>
            <button onClick={() => navigate("/bestiary")} style={{ display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "12px", fontFamily: "'Cinzel',serif", letterSpacing: "0.2em", padding: "8px 0" }}
              onMouseEnter={e => e.currentTarget.style.color = theme.accent}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
              <ArrowLeft size={14} /> BESTIÁRIO
            </button>
            <div style={{ fontSize: "11px", fontFamily: "'Cinzel',serif", letterSpacing: "0.3em", color: theme.color, opacity: 0.7 }}>
              {SOURCE_LABELS[creature.source] || creature.source}
            </div>
          </div>

          {/* Hero grid */}
          <div className="cr-main" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "40px", marginTop: "40px", alignItems: "start" }}>

            {/* Arte */}
            <div>
              <div className="cr-artwork" style={{ width: "100%", paddingTop: "125%", position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${theme.border}`, background: "rgba(0,0,0,0.6)" }}>
                <div style={{ position: "absolute", inset: 0 }}>
                  <CreatureArtwork creature={creature} theme={theme} />
                </div>
                {/* VD */}
                <div style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(0,0,0,0.85)", border: `2px solid ${theme.color}`, borderRadius: "8px", padding: "8px 14px", textAlign: "center", backdropFilter: "blur(8px)" }}>
                  <div style={{ fontSize: "9px", color: theme.color, fontFamily: "'Cinzel',serif", letterSpacing: "0.2em" }}>VD</div>
                  <div style={{ fontSize: "28px", fontWeight: "900", color: theme.accent, fontFamily: "'Cinzel',serif", lineHeight: 1, textShadow: `0 0 20px ${theme.glow}` }}>{creature.vd}</div>
                </div>
                {/* Elemento */}
                <div style={{ position: "absolute", bottom: "16px", left: "16px", background: `${theme.color}cc`, borderRadius: "20px", padding: "6px 16px", display: "flex", alignItems: "center", gap: "6px", backdropFilter: "blur(8px)" }}>
                  <span style={{ fontSize: "14px" }}>{theme.particle}</span>
                  <span style={{ fontSize: "11px", fontFamily: "'Cinzel',serif", fontWeight: "700", letterSpacing: "0.15em", color: "#fff" }}>{theme.label.toUpperCase()}</span>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                {[SIZE_LABELS[creature.size] || creature.size, creature.creature_type].filter(Boolean).map(tag => (
                  <span key={tag} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px", padding: "4px 12px", fontSize: "11px", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)" }}>
                    {tag?.toUpperCase()}
                  </span>
                ))}
                {creature.pp_immunity_nex && (
                  <span style={{ background: `${theme.color}22`, border: `1px solid ${theme.color}44`, borderRadius: "4px", padding: "4px 12px", fontSize: "11px", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", color: theme.accent }}>
                    NEX {creature.pp_immunity_nex}%+ IMUNE
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div>
              <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(22px,3.5vw,40px)", fontWeight: "900", color: "#fff", margin: "0 0 4px", lineHeight: 1.1, textShadow: `0 0 40px ${theme.color}66` }}>
                {creature.name}
              </h1>
              <div style={{ height: "2px", background: `linear-gradient(90deg, ${theme.color}, transparent)`, marginBottom: "20px", borderRadius: "1px" }} />

              <p style={{ fontSize: "16px", lineHeight: "1.75", color: "rgba(255,255,255,0.65)", fontStyle: "italic", margin: "0 0 24px" }}>
                {creature.description}
              </p>

              {creature.pp_dt && (
                <div style={{ background: `${theme.color}15`, border: `1px solid ${theme.border}`, borderRadius: "8px", padding: "14px 16px", marginBottom: "24px" }}>
                  <div style={{ fontSize: "10px", fontFamily: "'Cinzel',serif", letterSpacing: "0.3em", color: theme.color, marginBottom: "6px" }}>⚠ PRESENÇA PERTURBADORA</div>
                  <span style={{ fontSize: "14px", color: theme.accent, fontWeight: "600" }}>DT {creature.pp_dt}</span>
                  {creature.pp_damage && <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}> · {creature.pp_damage}</span>}
                </div>
              )}

              {/* Stats */}
              <div style={{ fontSize: "10px", fontFamily: "'Cinzel',serif", letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>ESTATÍSTICAS</div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                <StatBox label="PV" value={creature.pv} color="#e74c3c" />
                <StatBox label="MACHUCADO" value={creature.pv_machucado} color="#e67e22" />
                <StatBox label="DEFESA" value={creature.defesa} color={theme.accent} />
                <StatBox label="DESL." value={creature.movement ? `${creature.movement}m` : "—"} color="rgba(255,255,255,0.4)" />
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                <StatBox label="FORT" value={creature.fort} color="#27ae60" small />
                <StatBox label="REFL" value={creature.reflex} color="#3498db" small />
                <StatBox label="VONT" value={creature.vontade} color="#9b59b6" small />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "6px", marginBottom: "20px" }}>
                {[["AGI",creature.agi],["FOR",creature.for_],["INT",creature.int_],["PRE",creature.pre],["VIG",creature.vig]].map(([a,v]) => (
                  <div key={a} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "8px 4px", textAlign: "center" }}>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "rgba(255,255,255,0.9)", fontFamily: "'Cinzel',serif" }}>{v ?? "—"}</div>
                    <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{a}</div>
                  </div>
                ))}
              </div>

              {/* Resistências/Imunidades/Vulnerabilidades */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {Object.keys(resistances).length > 0 && (
                  <div style={{ background: "rgba(39,174,96,0.08)", border: "1px solid rgba(39,174,96,0.2)", borderRadius: "6px", padding: "10px 14px" }}>
                    <div style={{ fontSize: "10px", color: "#27ae60", fontFamily: "'Cinzel',serif", letterSpacing: "0.2em", marginBottom: "4px" }}>RESISTÊNCIAS</div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{Object.entries(resistances).map(([t,v]) => `${t} ${v}`).join(" · ")}</div>
                  </div>
                )}
                {vulnerabilities.length > 0 && (
                  <div style={{ background: "rgba(231,76,60,0.08)", border: "1px solid rgba(231,76,60,0.2)", borderRadius: "6px", padding: "10px 14px" }}>
                    <div style={{ fontSize: "10px", color: "#e74c3c", fontFamily: "'Cinzel',serif", letterSpacing: "0.2em", marginBottom: "4px" }}>VULNERABILIDADES</div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{vulnerabilities.join(" · ")}</div>
                  </div>
                )}
                {immunities.length > 0 && (
                  <div style={{ background: "rgba(155,89,182,0.08)", border: "1px solid rgba(155,89,182,0.2)", borderRadius: "6px", padding: "10px 14px" }}>
                    <div style={{ fontSize: "10px", color: "#9b59b6", fontFamily: "'Cinzel',serif", letterSpacing: "0.2em", marginBottom: "4px" }}>IMUNIDADES</div>
                    <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{immunities.join(" · ")}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Habilidades */}
          {abilities.length > 0 && (
            <div style={{ marginTop: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <div style={{ fontSize: "10px", fontFamily: "'Cinzel',serif", letterSpacing: "0.4em", color: theme.color }}>◆ HABILIDADES & AÇÕES</div>
                <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${theme.color}44, transparent)` }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {abilities.map((ab, i) => <AbilityCard key={i} ability={ab} theme={theme} />)}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: "48px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", fontFamily: "'Cinzel',serif", letterSpacing: "0.2em" }}>ORDEM PARANORMAL RPG</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)", fontFamily: "'Cinzel',serif", letterSpacing: "0.15em" }}>{SOURCE_LABELS[creature.source] || creature.source}</div>
          </div>
        </div>
      </div>
    </>
  );
}