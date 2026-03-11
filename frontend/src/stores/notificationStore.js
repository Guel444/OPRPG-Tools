import { create } from 'zustand';

export const useNotification = create((set) => ({
  notifications: [],

  add: (message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification = { id, message, type };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    if (duration) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  remove: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clear: () => set({ notifications: [] }),

  success: (message, duration) => set((state) => {
    const id = Math.random().toString(36).substr(2, 9);
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, duration || 4000);
    return {
      notifications: [...state.notifications, { id, message, type: 'success' }],
    };
  }),

  error: (message, duration) => set((state) => {
    const id = Math.random().toString(36).substr(2, 9);
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, duration || 6000);
    return {
      notifications: [...state.notifications, { id, message, type: 'error' }],
    };
  }),

  warning: (message, duration) => set((state) => {
    const id = Math.random().toString(36).substr(2, 9);
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, duration || 5000);
    return {
      notifications: [...state.notifications, { id, message, type: 'warning' }],
    };
  }),
}));
