import React from 'react';

/**
 * Componente Badge com variantes de cor semânticas para status e tipos
 */
export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    primary: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
    cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
}

/**
 * Retorna a badge apropriada para a situação cadastral
 */
export function SituacaoBadge({ situacao }) {
  if (!situacao) {
    return <Badge variant="default">Desconhecida</Badge>;
  }

  const s = String(situacao).toUpperCase();

  if (s.includes('ATIVA')) {
    return (
      <Badge variant="success">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        {situacao}
      </Badge>
    );
  }
  if (s.includes('BAIXADA')) {
    return (
      <Badge variant="danger">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        {situacao}
      </Badge>
    );
  }
  if (s.includes('SUSPENSA')) {
    return (
      <Badge variant="warning">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        {situacao}
      </Badge>
    );
  }
  if (s.includes('INAPTA')) {
    return (
      <Badge variant="danger">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
        {situacao}
      </Badge>
    );
  }
  if (s.includes('NULA')) {
    return (
      <Badge variant="default">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        {situacao}
      </Badge>
    );
  }

  return <Badge variant="default">{situacao}</Badge>;
}
