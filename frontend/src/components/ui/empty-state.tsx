import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-3">
        <div className="h-14 w-14 rounded-[24px] bg-rose-100/70 ring-1 ring-[#e7cdb8]" />
        <h3 className="font-display text-3xl text-ink-900">{title}</h3>
        <p className="text-sm leading-6 text-ink-800/72">{description}</p>
        {action}
      </div>
    </Card>
  );
}
