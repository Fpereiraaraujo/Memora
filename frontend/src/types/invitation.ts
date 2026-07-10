export type InvitationTheme = 'ROMANCE' | 'GARDEN' | 'MODERN';
export type GuestRsvpStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED';

export interface EventInvitationSettings {
  theme: InvitationTheme;
  rsvpEnabled: boolean;
  rsvpDeadline: string | null;
  ceremonyTime: string | null;
  receptionTime: string | null;
  dressCode: string | null;
  registryUrl: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
}

export interface EventGuest {
  id: string;
  invitationToken: string;
  name: string;
  phone: string | null;
  email: string | null;
  guestGroup: string | null;
  maxPlusOnes: number;
  rsvpStatus: GuestRsvpStatus;
  plusOnes: number;
  companionName: string | null;
  mealChoice: string | null;
  dietaryRestrictions: string | null;
  guestMessage: string | null;
  respondedAt: string | null;
  createdAt: string;
}

export interface EventRsvpSummary {
  totalGuests: number;
  pendingGuests: number;
  confirmedGuests: number;
  declinedGuests: number;
  confirmedPeople: number;
}

export interface PublicInvitation {
  eventTitle: string;
  eventDate: string | null;
  location: string | null;
  welcomeMessage: string;
  coverImageUrl: string | null;
  theme: InvitationTheme;
  rsvpDeadline: string | null;
  ceremonyTime: string | null;
  receptionTime: string | null;
  dressCode: string | null;
  registryUrl: string | null;
  rsvpEnabled: boolean;
  guestName: string;
  maxPlusOnes: number;
  rsvpStatus: GuestRsvpStatus;
  plusOnes: number;
  companionName: string | null;
  mealChoice: string | null;
  dietaryRestrictions: string | null;
  guestMessage: string | null;
}

export interface GuestCreateRequest {
  name: string;
  phone?: string;
  email?: string;
  guestGroup?: string;
  maxPlusOnes: number;
}

export interface PublicRsvpRequest {
  attending: boolean;
  plusOnes: number;
  companionName?: string;
  mealChoice?: string;
  dietaryRestrictions?: string;
  guestMessage?: string;
}
