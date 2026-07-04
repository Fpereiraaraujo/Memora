import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EVENT_TYPES, type EventCreateRequest } from '@/types/event';

interface EventFormProps {
  value: EventCreateRequest;
  onChange: (value: EventCreateRequest) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  busy?: boolean;
}

export function EventForm({ value, onChange, onSubmit, busy = false }: EventFormProps) {
  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-sand-100/80">Tipo</span>
          <Select value={value.type} onChange={(event) => onChange({ ...value, type: event.target.value as EventCreateRequest['type'] })}>
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-sand-100/80">Data</span>
          <Input type="date" value={value.eventDate ?? ''} onChange={(event) => onChange({ ...value, eventDate: event.target.value || null })} />
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium text-sand-100/80">Título</span>
        <Input type="text" placeholder="Ana e Bruno" value={value.title} onChange={(event) => onChange({ ...value, title: event.target.value })} />
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-sand-100/80">Local</span>
        <Textarea
          placeholder="Sao Paulo, SP"
          value={value.location ?? ''}
          onChange={(event) => onChange({ ...value, location: event.target.value || null })}
        />
      </label>

      <Button type="submit" disabled={busy}>
        {busy ? 'Salvando...' : 'Criar evento'}
      </Button>
    </form>
  );
}
