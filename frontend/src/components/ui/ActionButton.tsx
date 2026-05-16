import React from 'react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'navy' | 'denim' | 'olive' | 'white' | 'danger' | 'brown';
  className?: string;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, onClick, variant = 'navy', className = '', disabled = false }) => {
  const styles = {
    navy: 'bg-[#1D2B45] text-[#F8F8F6] hover:bg-[#295A8E]',
    denim: 'bg-[#295A8E] text-[#F8F8F6] hover:bg-[#1D2B45]',
    olive: 'bg-[#4F6355] text-[#F8F8F6] hover:bg-[#1D2B45]',
    white: 'bg-[#F8F8F6] text-[#1D2B45] hover:bg-[#EBE6D9]',
    danger: 'bg-[#ef4444] text-[#F8F8F6] hover:bg-[#b91c1c]',
    brown: 'bg-[#5E4E46] text-[#F8F8F6] hover:bg-[#1D2B45]',
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        border-2 border-[#1D2B45] 
        ${disabled ? 'opacity-50 cursor-not-allowed shadow-[0px_0px_0px_0px_#1D2B45] translate-y-[3px] translate-x-[3px]' : 'shadow-[3px_3px_0px_0px_#1D2B45] active:shadow-[0px_0px_0px_0px_#1D2B45] active:translate-y-[3px] active:translate-x-[3px]'}
        px-4 py-2 font-bold uppercase tracking-wider text-xs transition-all flex items-center space-x-2
        ${styles[variant]} ${className}
      `}
    >
      {children}
    </button>
  );
};
