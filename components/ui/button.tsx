import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-[transform,background-color,border-color,box-shadow,color] duration-200 will-change-transform active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--accent,#0f172a)] text-white shadow-sm hover:bg-[var(--accent-hover,#1e293b)] hover:shadow-md',
        ghost: 'hover:bg-slate-100 hover:text-slate-900 active:bg-slate-100',
        outline:
          'border border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild: _asChild, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
