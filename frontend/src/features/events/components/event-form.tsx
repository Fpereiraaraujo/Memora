import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  EVENT_TYPES,
  EVENT_TYPE_LABELS,
  type EventCreateRequest,
} from '@/types/event';

interface EventFormProps {
  value: EventCreateRequest;
  onChange: (value: EventCreateRequest) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  busy?: boolean;
}

export function EventForm({
  value,
  onChange,
  onSubmit,
  busy = false,
}: EventFormProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <label className="space-y-2">
        <span className="text-sm font-bold text-ink-800/80">
          Título do evento
        </span>

        <Input
          type="text"
          placeholder="Ex: Aniversário da Marina"
          value={value.title}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
          required
        />

        <p className="text-xs leading-5 text-ink-800/48">
          Esse nome aparece no painel e na pagina publica aberta pelo QR Code.
        </p>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-ink-800/80">
            Data
          </span>

          <Input
            type="date"
            value={value.eventDate ?? ''}
            onChange={(event) =>
              onChange({
                ...value,
                eventDate: event.target.value || null,
              })
            }
          />
        </label>

        <div className="space-y-2">
          <span className="text-sm font-bold text-ink-800/80">
            Tipo
          </span>

          <select
            value={value.type}
            onChange={(event) =>
              onChange({ ...value, type: event.target.value as EventCreateRequest['type'] })
            }
            className="h-12 w-full rounded-2xl border border-[#ead7ca] bg-[#fffaf7] px-4 text-sm font-semibold text-[#7f5a3c] outline-none transition focus:border-[#ef7885] focus:ring-4 focus:ring-[#ef7885]/10"
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {EVENT_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-bold text-ink-800/80">
          Local
        </span>

        <Textarea
          placeholder="Ex: Espaco Jardim das Flores, Curitiba - PR"
          value={value.location ?? ''}
          onChange={(event) =>
            onChange({
              ...value,
              location: event.target.value || null,
            })
          }
          className="min-h-[100px]"
        />

        <p className="text-xs leading-5 text-ink-800/48">
          O local e opcional e ajuda a deixar a pagina dos convidados mais completa.
        </p>
      </label>

      <Button type="submit" disabled={busy} loading={busy} className="w-full py-4">
        {busy ? 'Criando evento...' : 'Criar evento'}
      </Button>
    </form>
  );
}
