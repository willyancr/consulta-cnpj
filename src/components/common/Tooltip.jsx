import React, { useState, useRef, useId } from 'react';
import { InfoIcon } from '../icons/Icons';

export function Tooltip({ title, description, children }) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();
  const timeoutRef = useRef(null);

  const show = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const hide = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 120);
  };

  return (
    <span 
      className="relative inline-flex items-center align-middle"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children || (
        <button
          type="button"
          aria-describedby={isVisible ? tooltipId : undefined}
          aria-label={`Informações sobre ${title || 'este campo'}`}
          className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-colors ml-1 inline-flex items-center"
        >
          <InfoIcon className="w-4 h-4" />
        </button>
      )}

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-sm text-slate-100 text-xs rounded-xl shadow-xl border border-slate-700 pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95"
        >
          {title && (
            <div className="font-semibold text-blue-300 mb-1 border-b border-slate-700/60 pb-1">
              {title}
            </div>
          )}
          <p className="text-slate-200 leading-relaxed font-normal">{description}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800" />
        </div>
      )}
    </span>
  );
}
