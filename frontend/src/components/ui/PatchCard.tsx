import React from 'react';

interface PatchCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'cream' | 'navy' | 'denim' | 'olive' | 'brown';
}

export const PatchCard: React.FC<PatchCardProps> = ({ children, className = '', variant = 'white' }) => {
  const styles = {
    white: 'bg-[#F8F8F6] text-[#111827]',
    cream: 'bg-[#EBE6D9] text-[#111827]',
    navy: 'bg-[#1D2B45] text-[#F8F8F6]',
    denim: 'bg-[#295A8E] text-[#F8F8F6]',
    olive: 'bg-[#4F6355] text-[#F8F8F6]',
    brown: 'bg-[#5E4E46] text-[#F8F8F6]'
  };

  return (
    <div className={`
      border-2 border-[#1D2B45] 
      shadow-[4px_4px_0px_0px_#1D2B45] 
      rounded-sm p-6 
      ${styles[variant]} 
      ${className}
    `}>
      {children}
    </div>
  );
};
