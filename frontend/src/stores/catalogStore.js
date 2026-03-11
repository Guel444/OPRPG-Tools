import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useCatalogStore = create((set, get) => ({
  creatures: [],
  rituals: [],
  arsenal: [],
  powers: [],
  loading: false,
  error: null,
  lastFetch: {},

  fetchCreatures: async (force = false) => {
    const { creatures, lastFetch } = get();
    const now = Date.now();
    const cacheTime = lastFetch.creatures || 0;

    if (creatures.length > 0 && !force && now - cacheTime < 3600000) {
      return creatures;
    }

    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/catalog/creatures`);
      set({
        creatures: res.data,
        lastFetch: { ...lastFetch, creatures: now },
        loading: false,
      });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Erro ao carregar bestiário',
        loading: false,
      });
      return [];
    }
  },

  fetchRituals: async (force = false) => {
    const { rituals, lastFetch } = get();
    const now = Date.now();
    const cacheTime = lastFetch.rituals || 0;

    if (rituals.length > 0 && !force && now - cacheTime < 3600000) {
      return rituals;
    }

    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/catalog/rituals`);
      set({
        rituals: res.data,
        lastFetch: { ...lastFetch, rituals: now },
        loading: false,
      });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Erro ao carregar rituais',
        loading: false,
      });
      return [];
    }
  },

  fetchArsenal: async (force = false) => {
    const { arsenal, lastFetch } = get();
    const now = Date.now();
    const cacheTime = lastFetch.arsenal || 0;

    if (arsenal.length > 0 && !force && now - cacheTime < 3600000) {
      return arsenal;
    }

    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/catalog/arsenal`);
      set({
        arsenal: res.data,
        lastFetch: { ...lastFetch, arsenal: now },
        loading: false,
      });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Erro ao carregar arsenal',
        loading: false,
      });
      return [];
    }
  },

  fetchPowers: async (force = false) => {
    const { powers, lastFetch } = get();
    const now = Date.now();
    const cacheTime = lastFetch.powers || 0;

    if (powers.length > 0 && !force && now - cacheTime < 3600000) {
      return powers;
    }

    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/catalog/powers`);
      set({
        powers: res.data,
        lastFetch: { ...lastFetch, powers: now },
        loading: false,
      });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Erro ao carregar poderes',
        loading: false,
      });
      return [];
    }
  },

  clearCache: () => set({
    creatures: [],
    rituals: [],
    arsenal: [],
    powers: [],
    lastFetch: {},
  }),
}));
