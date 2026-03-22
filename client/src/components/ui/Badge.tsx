import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

const variants = {
  default: 'bg-stone-950 text-stone-50',
  secondary: 'bg-stone-100 text-stone-700',
  outline: 'border border-stone-200 text-stone-600',
};

export default function Badge({ children, variant = 'secondary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
