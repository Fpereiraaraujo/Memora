export function buildEventOverviewPath(eventId: string) {
  return `/app/events/${eventId}`;
}

export function buildEventCheckoutPath(eventId: string) {
  return `/app/events/${eventId}/checkout`;
}

export function buildEventQrPath(eventId: string) {
  return `/app/events/${eventId}/qrcode`;
}

export function buildEventQrArtPath(eventId: string) {
  return `/app/events/${eventId}/qr-art`;
}

export function buildEventGalleryPath(eventId: string) {
  return `/app/events/${eventId}/gallery`;
}

export function buildEventFavoritesPath(eventId: string) {
  return `/app/events/${eventId}/favorites`;
}

export function buildEventDownloadsPath(eventId: string) {
  return `/app/events/${eventId}/downloads`;
}

export function buildEventMessagesPath(eventId: string) {
  return `/app/events/${eventId}/messages`;
}

export function buildEventPublicPageSettingsPath(eventId: string) {
  return `/app/events/${eventId}/public-page`;
}

export function buildEventInvitationPath(eventId: string) {
  return `/app/events/${eventId}/invitation`;
}
