import React, { useEffect } from 'react';
import { CheckCircleIcon, AlertCircleIcon, CloseIcon } from '../icons/Icons';

export function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl shadow-2xl border border-slate-700 dark:border-slate-300 animate-in slide-in-from-bottom-5 duration-200">
      {isSuccess ? (
        <CheckCircleIcon className="w-5 h-5 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
      ) : (
        <AlertCircleIcon className="w-5 h-5 text-rose-400 dark:text-rose-600 flex-shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar notificação"
        className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-black ml-2"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
