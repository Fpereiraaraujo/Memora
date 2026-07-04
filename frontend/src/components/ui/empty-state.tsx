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
        <div className="h-14 w-14 rounded-2xl bg-sand-100/15 ring-1 ring-sand-100/20" />
        <h3 className="font-display text-2xl text-sand-50">{title}</h3>
        <p className="text-sm leading-6 text-sand-100/70">{description}</p>
        {action}
      </div>
    </Card>
  );
}
