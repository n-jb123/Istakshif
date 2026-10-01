export type Role = 'guest' | 'adventurer' | 'organizer' | 'admin';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type NatureCategory =
  | 'nature_mountains'
  | 'historical_archaeological'
  | 'sea_beaches'
  | 'religious_visits'
  | 'adventures'
  | 'cultural_arts'
  | 'volunteering';

export type BookingStatus =
  | 'pending_payment'
  | 'payment_review'
  | 'confirmed'
  | 'waitlisted'
  | 'cancelled_by_user'
  | 'cancelled_by_organizer'
  | 'cancelled_auto'
  | 'no_show'
  | 'attended'
  | 'refund_pending'
  | 'refunded';

export type TripStatus =
  | 'draft'
  | 'pending_review'
  | 'rejected'
  | 'published'
  | 'full'
  | 'cancelled'
  | 'completed';

export interface Governorate {
  id: string;
  nameAr: string;
  isActive: boolean;
}

export interface DayProgram {
  day: number;
  title: string;
  description: string;
  time?: string;
}

export interface Rating {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  date: string;
  tripStars: number;
  organizerStars: number;
  comment: string;
}

export interface Question {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  date: string;
  question: string;
  answer?: string;
  answeredAt?: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  fromGovernorateId: string;
  toGovernorateId: string;
  startDate: string;
  endDate: string;
  durationText: string;
  difficulty: DifficultyLevel;
  categories: NatureCategory[];
  meetingPoint: string;
  transportType: string;
  included: string[];
  notIncluded: string[];
  whatToBring: string[];
  minAge: number;
  maxAge: number;
  pricePerPerson: number;
  discountPrice?: number;
  seatsTotal: number;
  seatsTaken: number;
  minParticipants: number;
  minDeadlineHours: number;
  whatsappNumber: string;
  groupLink: string;
  isFeatured: boolean;
  featuredUntil?: string;
  status: TripStatus;
  organizerId: string;
  organizerName: string;
  organizerVerified: boolean;
  organizerRating: number;
  organizerTripsCount: number;
  images: string[];
  dailyProgram: DayProgram[];
  ratings: Rating[];
  questions: Question[];
  cancellationPolicyShort?: string;
}

export interface Companion {
  name: string;
  age: number;
}

export interface Booking {
  id: string;
  tripId: string;
  tripTitle: string;
  tripImage: string;
  fromGovernorate: string;
  toGovernorate: string;
  startDate: string;
  seatsCount: number;
  companions: Companion[];
  pricePerSeat: number;
  depositPerSeat: number;
  depositTotal: number;
  remainingToOrganizer: number;
  status: BookingStatus;
  paymentMethod?: 'sham_cash' | 'syriatel_cash';
  transactionRef?: string;
  receiptPath?: string;
  bookedAt: string;
  holdExpiresAt?: string;
  organizerWhatsApp?: string;
  groupLink?: string;
  attendedStatus?: 'attended' | 'no_show';
}

export interface OrganizerProfile {
  id: string;
  userId: string;
  orgName: string;
  logo: string;
  coverImage?: string;
  description: string;
  governorates: string[];
  verified: boolean;
  tripsCount: number;
  rating: number;
  joinedDate: string;
  strikesCount: number;
  status: 'pending' | 'approved' | 'rejected' | 'banned';
  rejectionReason?: string;
  idDocumentUrl?: string;
  activityProofUrls?: string[];
  reviewedTripsCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  role: Role;
  avatar?: string;
  emergencyContact?: string;
  isBanned?: boolean;
  visitedGovernorates: string[];
  badges: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'booking' | 'payment' | 'trip' | 'strike' | 'waitlist' | 'system';
  date: string;
  read: boolean;
  linkPage?: string;
  linkId?: string;
}

export interface PlatformSettings {
  commissionPercent: number; // e.g. 10
  maxSeatsPerBooking: number; // 4
  cancelLockHours: number; // 48
  minDeadlineHours: number; // 72
  paymentHoldHours: number; // 24
  waitlistClaimHours: number; // 12
  attendanceWindowHours: number; // 24
  ratingWindowDays: number; // 3
  strikesToBan: number; // 3
  reviewFirstNTrips: number; // 3
  walletShamCash: string;
  walletSyriatelCash: string;
  supportWhatsapp: string;
  supportEmail: string;
}
