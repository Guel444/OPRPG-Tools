import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../stores/notificationStore';
import { AlertCircle, CheckCircle, AlertTriangle, X } from 'lucide-react';

export function NotificationContainer() {
  const { notifications, remove } = useNotification();

  const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <AlertCircle size={18} />,
  };

  const colors = {
    success: 'bg-green-900/30 border-green-800 text-green-300',
    error: 'bg-red-900/30 border-red-800 text-red-300',
    warning: 'bg-yellow-900/30 border-yellow-800 text-yellow-300',
    info: 'bg-blue-900/30 border-blue-800 text-blue-300',
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] pointer-events-none max-w-sm space-y-2">
      <AnimatePresence mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`
              flex items-start gap-3 px-4 py-3 rounded border pointer-events-auto
              ${colors[notif.type]}
            `}
          >
            <div className="flex-shrink-0 mt-0.5">{icons[notif.type]}</div>
            <p className="flex-1 text-sm leading-relaxed">{notif.message}</p>
            <button
              onClick={() => remove(notif.id)}
              className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Fechar notificação"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
