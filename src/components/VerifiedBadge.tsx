import React from 'react';

interface VerifiedBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  tooltip?: string;
}

/**
 * VerifiedBadge - Selo de Verificado oficial no estilo do Instagram e Facebook (Blue Check).
 * Exibido para usuários verificados e aprovados pelo Administrador Neidilson Neves.
 */
export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  size = 'md',
  className = '',
  tooltip = 'Conta Oficialmente Verificada pelo Administrador Neidilson Neves',
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 align-middle select-none transition-transform hover:scale-110 ${className}`}
      title={tooltip}
      aria-label="Perfil Verificado Oficialmente"
    >
      <svg
        className={`${sizeClasses[size]} drop-shadow-xs`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Meta / Instagram / Facebook Scalloped rosette shape (Azul Oficial #0095F6 / #1877F2) */}
        <path
          d="M10.5 2.5a2 2 0 013 0l.9 1a2 2 0 001.6.6h1.3a2 2 0 012 2v1.3a2 2 0 00.6 1.6l1 .9a2 2 0 010 3l-1 .9a2 2 0 00-.6 1.6V17a2 2 0 01-2 2h-1.3a2 2 0 00-1.6.6l-.9 1a2 2 0 01-3 0l-.9-1a2 2 0 00-1.6-.6H5a2 2 0 01-2-2v-1.3a2 2 0 00-.6-1.6l-1-.9a2 2 0 010-3l1-.9a2 2 0 00.6-1.6V5a2 2 0 012-2h1.3a2 2 0 001.6-.6l.9-1z"
          fill="#0095F6"
        />
        {/* Crisp white checkmark */}
        <path
          d="M8.8 12.3l2.2 2.2 4.4-4.6"
          stroke="#FFFFFF"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};
