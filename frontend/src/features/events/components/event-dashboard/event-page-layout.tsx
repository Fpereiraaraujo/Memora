import type { ReactNode } from 'react';

import { EmptyState } from '@/components/ui/empty-state';
import { EventDashboardShell } from '@/features/events/components/event-dashboard/event-dashboard-shell';
import { EventLoadingState } from '@/features/events/components/event-dashboard/event-loading-state';
import { EventSidebar } from '@/features/events/components/event-dashboard/event-sidebar';
import type { UseEventDashboardResult } from '@/features/events/hooks/use-event-dashboard';

interface EventPageLayoutProps {
  eventId?: string;
  dashboard: UseEventDashboardResult;
  emptyTitle: string;
  emptyDescription: string;
  children: ReactNode;
}

function EventNotFoundState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-screen bg-[#fff8f3] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <EmptyState title={title} description={description} />
      </div>
    </div>
  );
}

export function EventPageLayout({
  eventId,
  dashboard,
  emptyTitle,
  emptyDescription,
  children,
}: EventPageLayoutProps) {
  if (!eventId) {
    return <EventNotFoundState title={emptyTitle} description={emptyDescription} />;
  }

  if (dashboard.loading) {
    return <EventLoadingState />;
  }

  if (!dashboard.event) {
    return <EventNotFoundState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <EventDashboardShell
      sidebar={
        <EventSidebar
          event={dashboard.event}
          publicCopied={dashboard.copied}
          uploadCopied={dashboard.uploadLinkCopied}
          onCopyPublicLink={dashboard.copyPublicLink}
          onCopyUploadLink={dashboard.copyUploadLink}
        />
      }
    >
      {children}
    </EventDashboardShell>
  );
}
