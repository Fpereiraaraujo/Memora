import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EVENT_TYPES, type EventCreateRequest, type EventType } from '@/types/event';

interface EventFormProps {
    value: EventCreateRequest;
    onChange: (value: EventCreateRequest) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    busy?: boolean;
}

const EVENT_TYPE_LABELS: Record<EventType, string> = {
    WEDDING: 'Casamento',
    BIRTHDAY: 'Aniversário',
    GRADUATION: 'Formatura',
    BABY_SHOWER: 'Chá de bebê',
    BAPTISM: 'Batizado',
    CORPORATE: 'Evento corporativo',
    OTHER: 'Outro evento',
};

const EVENT_TYPE_DESCRIPTIONS: Record<EventType, string> = {
    WEDDING: 'Ideal para noivos reunirem fotos dos convidados.',
    BIRTHDAY: 'Para festas infantis, adultas e celebrações familiares.',
    GRADUATION: 'Para registrar a conquista com amigos e família.',
    BABY_SHOWER: 'Para guardar mensagens e fotos desse momento especial.',
    BAPTISM: 'Para cerimônias íntimas e registros familiares.',
    CORPORATE: 'Para confraternizações, workshops e eventos internos.',
    OTHER: 'Para qualquer evento que mereça uma galeria compartilhada.',
};

export function EventForm({
                              value,
                              onChange,
                              onSubmit,
                              busy = false,
                          }: EventFormProps) {
    const selectedDescription = EVENT_TYPE_DESCRIPTIONS[value.type];

    return (
        <form className="space-y-5" onSubmit={onSubmit}>
            <label className="space-y-2">
        <span className="text-sm font-bold text-ink-800/80">
          Nome do evento
        </span>

                <Input
                    type="text"
                    placeholder="Ex: Casamento Isadora & Fernando"
                    value={value.title}
                    onChange={(event) => onChange({ ...value, title: event.target.value })}
                    required
                />

                <p className="text-xs leading-5 text-ink-800/48">
                    Esse nome aparecerá no painel e na página pública aberta pelo QR Code.
                </p>
            </label>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
          <span className="text-sm font-bold text-ink-800/80">
            Tipo de evento
          </span>

                    <Select
                        value={value.type}
                        onChange={(event) =>
                            onChange({
                                ...value,
                                type: event.target.value as EventCreateRequest['type'],
                            })
                        }
                    >
                        {EVENT_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {EVENT_TYPE_LABELS[type]}
                            </option>
                        ))}
                    </Select>
                </label>

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
            </div>

            <div className="rounded-[1.7rem] border border-[#f0d8ca] bg-[#fffaf7] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b9852f]">
                    Sobre esse tipo
                </p>

                <p className="mt-2 text-sm leading-7 text-ink-800/68">
                    {selectedDescription}
                </p>
            </div>

            <label className="space-y-2">
        <span className="text-sm font-bold text-ink-800/80">
          Local
        </span>

                <Textarea
                    placeholder="Ex: Espaço Jardim das Flores, Curitiba - PR"
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
                    O local é opcional, mas ajuda a deixar a página pública mais completa.
                </p>
            </label>

            <div className="rounded-[1.7rem] bg-ink-900 p-5 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/50">
                    Próximo passo
                </p>

                <p className="mt-2 text-sm leading-7 text-white/75">
                    Depois de criar o evento, voce escolhe um plano e segue para o checkout da InfinityPay. Assim que o pagamento for aprovado, o QR Code, o link publico e a galeria ficam liberados.
                </p>
            </div>

            <Button type="submit" disabled={busy} className="w-full py-4">
                {busy ? 'Criando evento...' : 'Criar evento'}
            </Button>
        </form>
    );
}
