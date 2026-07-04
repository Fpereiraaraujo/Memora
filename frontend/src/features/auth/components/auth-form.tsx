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
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand-100/55">Memora</p>
        <h2 className="font-display text-3xl text-sand-50">{title}</h2>
        <p className="text-sm leading-6 text-sand-100/70">{description}</p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        {children}

        {alert ? (
          <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {alert}
          </div>
        ) : null}

        <Button className="w-full" type="submit" disabled={busy}>
          {busy ? 'Aguarde...' : submitLabel}
        </Button>
      </form>

      <div className="mt-6 text-sm text-sand-100/70">{footer}</div>
    </Card>
  );
}
