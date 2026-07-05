import { Link } from 'react-router-dom';

import { formatRelativeTime, getInitials } from '@/features/events/utils/event-dashboard-formatters';
import type { Photo } from '@/types/photo';

interface EventMessagesCardProps {
  messages: Photo[];
  messagesPath: string;
}

function MessageAvatar({ name }: { name: string | null }) {
  return (
    <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#f4a2aa,#ef7885)] text-sm font-bold text-white">
      {getInitials(name)}
    </div>
  );
}

export function EventMessagesCard({ messages, messagesPath }: EventMessagesCardProps) {
  return (
    <section
      id="recados"
      className="rounded-[24px] border border-[#f1ddd1] bg-white p-6 shadow-[0_22px_60px_rgba(96,60,36,0.08)]"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-[#161314]">Recados dos convidados</h2>

        <Link to={messagesPath} className="text-sm font-bold text-[#ef7885] transition hover:text-[#e86d7b]">
          Ver todos
        </Link>
      </div>

      <div className="mt-6 divide-y divide-[#f0ded4]">
        {messages.slice(0, 3).map((photo) => (
          <div key={photo.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <MessageAvatar name={photo.guestName ?? 'Convidado'} />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold text-[#161314]">{photo.guestName || 'Convidado anônimo'}</p>

                <span className="shrink-0 text-xs font-medium text-[#2c2927]/45">
                  {formatRelativeTime(photo.createdAt)}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-[#2c2927]/72">{photo.guestMessage}</p>
            </div>
          </div>
        ))}

        {messages.length === 0 ? (
          <div className="rounded-[18px] bg-[#fff7f2] p-5 text-sm leading-7 text-[#2c2927]/62">
            Nenhum recado ainda. Quando os convidados enviarem mensagens pela página pública, elas aparecerão aqui.
          </div>
        ) : null}
      </div>
    </section>
  );
}
