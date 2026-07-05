import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AuthFormProps {
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
  submitLabel: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  busy?: boolean;
  alert?: string | null;
}

export function AuthForm({
  title,
  description,
  footer,
  children,
  submitLabel,
  onSubmit,
  busy = false,
  alert = null,
}: AuthFormProps) {
  return (
    <Card className="w-full max-w-md p-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#b88763]">Memora</p>
        <h2 className="font-display text-4xl text-ink-900">{title}</h2>
        <p className="text-sm leading-6 text-ink-800/72">{description}</p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        {children}

        {alert ? (
          <div className="rounded-[24px] border border-rose-200 bg-rose-100/80 px-4 py-3 text-sm text-rose-500">
            {alert}
          </div>
        ) : null}

        <Button className="w-full" type="submit" disabled={busy}>
          {busy ? 'Aguarde...' : submitLabel}
        </Button>
      </form>

      <div className="mt-6 text-sm text-ink-800/72">{footer}</div>
    </Card>
  );
}
