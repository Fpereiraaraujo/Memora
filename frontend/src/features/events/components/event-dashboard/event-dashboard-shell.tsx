import type { ReactNode } from 'react';

import { FloralStage } from '@/components/theme/floral-stage';

interface EventDashboardShellProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function EventDashboardShell({ sidebar, children }: EventDashboardShellProps) {
  return (
    <FloralStage className="min-h-screen px-4 py-6 text-[#201914] sm:px-6 lg:px-8" petals={false}>
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {sidebar}

          <main className="min-w-0 space-y-6" id="painel">
            {children}
          </main>
        </div>
      </div>
    </FloralStage>
  );
}
