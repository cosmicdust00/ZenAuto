import React from 'react';

interface BadgeProps {
  status: 'available' | 'rented' | 'maintenance' | 'withdrawn' | 'in_progress' | 'completed' | 'success';
  label?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, label }) => {
  const styles = {
    available: 'bg-[#EBE6D9] text-[#1D2B45] border-[#1D2B45]',
    rented: 'bg-[#295A8E] text-[#F8F8F6] border-[#1D2B45]',
    maintenance: 'bg-[#5E4E46] text-[#F8F8F6] border-[#1D2B45]',
    withdrawn: 'bg-[#ef4444] text-[#F8F8F6] border-[#1D2B45]',
    in_progress: 'bg-[#4F6355] text-[#F8F8F6] border-[#1D2B45]',
    completed: 'bg-[#1D2B45] text-[#F8F8F6] border-[#1D2B45]',
    success: 'bg-[#EBE6D9] text-[#1D2B45] border-[#1D2B45]'
  };
  
  const labels = {
    available: 'Available', rented: 'Rented', maintenance: 'Maintenance',
    withdrawn: 'Withdrawn', in_progress: 'In Progress', completed: 'Completed', success: 'Success'
  };

  return (
    <span className={`px-3 py-1 border-2 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#1D2B45] ${styles[status]}`}>
      {label || labels[status] || status}
    </span>
  );
};
