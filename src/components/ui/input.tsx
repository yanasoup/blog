import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'text-sm-regular h-12 w-full rounded-xl px-4 py-2 text-neutral-950 outline-none placeholder:text-neutral-500',
        'border border-neutral-300 focus:ring-[1px] focus:ring-neutral-300',
        className
      )}
      {...props}
    />
  );
}

export { Input };
