'use client';

import { PhoneIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { maskPhone } from '@/lib/dummy-data';

interface MaskedPhoneProps {
  phone: string;
  masked?: boolean;
  className?: string;
}

export function MaskedPhone({ phone, masked = true, className }: MaskedPhoneProps) {
  const displayPhone = masked ? maskPhone(phone) : phone;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <PhoneIcon className="h-4 w-4 text-muted-foreground" />
      <span className={cn('font-mono', masked && 'text-muted-foreground')}>
        {displayPhone}
      </span>
    </div>
  );
}
