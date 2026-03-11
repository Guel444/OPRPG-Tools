import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export function useCatalog(endpoint, params = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paramKey = JSON.stringify(params);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: result } = await axios.get(`${API}/catalog/${endpoint}`, { params });
      setData(result);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao buscar dados');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, paramKey]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useCatalogItem(endpoint, slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    axios.get(`${API}/catalog/${endpoint}/${slug}`)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || 'Erro'))
      .finally(() => setLoading(false));
  }, [endpoint, slug]);

  return { data, loading, error };
}

export function useCharacters() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/characters`);
      setCharacters(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao buscar fichas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const createCharacter = async (charData) => {
    const { data } = await axios.post(`${API}/characters`, charData);
    setCharacters(prev => [data, ...prev]);
    return data;
  };

  const updateCharacter = async (id, updates) => {
    const { data } = await axios.put(`${API}/characters/${id}`, updates);
    setCharacters(prev => prev.map(c => c.id === id ? data : c));
    return data;
  };

  const deleteCharacter = async (id) => {
    await axios.delete(`${API}/characters/${id}`);
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  return { characters, loading, error, createCharacter, updateCharacter, deleteCharacter, refetch: fetch };
}

// Converte NEX% para número de "estágios" (5%=1, 10%=2, ..., 95%=19, 99%=20)
// O NEX 99% é tratado como o 20º estágio (equivalente a um 100% que nunca ocorre naturalmente)
export function nexToStage(nex) {
  if (nex === 99) return 20;
  return Math.floor(nex / 5);
}

// Quantos aumentos de atributo o personagem recebe até determinado NEX
// Aumentos ocorrem em: 20%, 50%, 80%, 95% → 4 aumentos no total
export function attrIncreasesByNex(nex) {
  const breakpoints = [20, 50, 80, 95];
  return breakpoints.filter(bp => nex >= bp).length;
}

// Lógica de cálculo de derivadas baseada nas regras do Livro Base + Sobrevivendo ao Horror
// Combatente:   PV = 20+VIG, +4+VIG/NEX | PE = 2+PRE, +2+PRE/NEX | SAN = 12, +3/NEX
//                                         | PD (SaH) = 6+PRE, +3+PRE/NEX
// Especialista: PV = 16+VIG, +3+VIG/NEX | PE = 3+PRE, +3+PRE/NEX | SAN = 16, +4/NEX
//                                         | PD (SaH) = 8+PRE, +4+PRE/NEX
// Ocultista:    PV = 12+VIG, +2+VIG/NEX | PE = 4+PRE, +4+PRE/NEX | SAN = 20, +5/NEX
//                                         | PD (SaH) = 10+PRE, +5+PRE/NEX
export function calculateDerived({ class: cls, nex, agi, for: FOR, int: INT, pre, vig, use_pd }) {
  const VIG = vig || 0;
  const PRE = pre || 0;
  const AGI = agi || 0;
  const stage = nexToStage(nex);
  const extraStages = Math.max(stage - 1, 0);

  const configs = {
    combatente:  { pvBase: 20, pvPerStage: 4, peBase: 2, pePerStage: 2, sanBase: 12, sanPerStage: 3, pdBase: 6, pdPerStage: 3 },
    especialista:{ pvBase: 16, pvPerStage: 3, peBase: 3, pePerStage: 3, sanBase: 16, sanPerStage: 4, pdBase: 8, pdPerStage: 4 },
    ocultista:   { pvBase: 12, pvPerStage: 2, peBase: 4, pePerStage: 4, sanBase: 20, sanPerStage: 5, pdBase: 10, pdPerStage: 5 },
  };
  const c = configs[cls] || configs.combatente;

  const pvMax  = c.pvBase + VIG + (c.pvPerStage + VIG) * extraStages;
  const peMax  = c.peBase + PRE + (c.pePerStage + PRE) * extraStages;
  const sanMax = c.sanBase + c.sanPerStage * extraStages;
  const pdMax  = c.pdBase + PRE + (c.pdPerStage + PRE) * extraStages; // Sobrevivendo ao Horror

  return {
    pvMax,
    peMax,
    sanMax,
    pdMax,
    defesa: 10 + AGI,
    peLimit: stage,
    attrIncreases: attrIncreasesByNex(nex),
  };
}