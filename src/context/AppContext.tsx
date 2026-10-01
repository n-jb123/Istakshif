import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Trip,
  OrganizerProfile,
  UserProfile,
  Booking,
  AppNotification,
  PlatformSettings,
} from '../types';
import {
  INITIAL_TRIPS,
  INITIAL_ORGANIZERS,
  INITIAL_USER,
  INITIAL_BOOKINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'danger' | 'warning';
}

interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentPage: string;
  pageParams: Record<string, any>;
  navigate: (page: string, params?: Record<string, any>) => void;
  trips: Trip[];
  organizers: OrganizerProfile[];
  bookings: Booking[];
  user: UserProfile;
  favorites: string[];
  notifications: AppNotification[];
  settings: PlatformSettings;
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'danger' | 'warning') => void;
  dismissToast: (id: string) => void;
  
  // Modals
  authModalOpen: boolean;
  authMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  loginUser: (email: string, role?: Role) => void;
  logoutUser: () => void;

  bookingModalTrip: Trip | null;
  openBookingModal: (trip: Trip) => void;
  closeBookingModal: () => void;

  cancelModalBooking: Booking | null;
  openCancelModal: (b: Booking) => void;
  closeCancelModal: () => void;

  rateModalBooking: Booking | null;
  openRateModal: (b: Booking) => void;
  closeRateModal: () => void;

  // Actions
  toggleFavorite: (tripId: string) => void;
  submitBooking: (bookingData: Omit<Booking, 'id' | 'bookedAt'>) => Booking;
  cancelSeat: (bookingId: string, refundAmount: number) => void;
  submitRating: (tripId: string, tripStars: number, orgStars: number, comment: string) => void;
  submitQuestion: (tripId: string, questionText: string) => void;
  answerQuestion: (tripId: string, questionId: string, answerText: string) => void;
  confirmPaymentAdmin: (bookingId: string) => void;
  rejectPaymentAdmin: (bookingId: string, reason: string) => void;
  approveVerificationAdmin: (orgId: string) => void;
  rejectVerificationAdmin: (orgId: string, reason: string) => void;
  publishTripAdmin: (tripId: string) => void;
  createTripOrganizer: (trip: Partial<Trip>) => Trip;
  updateAttendanceOrganizer: (tripId: string, noShowUserIds: string[]) => void;
  submitUpgradeOrganizer: (data: { orgName: string; description: string; phone: string; governorates: string[] }) => void;
  markNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('istakshif_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  });
  const [currentRole, setCurrentRole] = useState<Role>('adventurer');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<Record<string, any>>({});
  
  const [trips, setTrips] = useState<Trip[]>(INITIAL_TRIPS);
  const [organizers, setOrganizers] = useState<OrganizerProfile[]>(INITIAL_ORGANIZERS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [favorites, setFavorites] = useState<string[]>(['trip-1']);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<PlatformSettings>(INITIAL_SETTINGS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [bookingModalTrip, setBookingModalTrip] = useState<Trip | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [rateModalBooking, setRateModalBooking] = useState<Booking | null>(null);

  // Sync dark class on HTML
  useEffect(() => {
    try {
      localStorage.setItem('istakshif_theme', theme);
    } catch {
      // ignore
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = '#0A2E36';
      document.body.style.color = '#F4EFE6';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.style.backgroundColor = '#F6F1EA';
      document.body.style.color = '#0A2E36';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const navigate = (page: string, params: Record<string, any> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message: string, type: 'success' | 'danger' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const loginUser = (email: string, targetRole: Role = 'adventurer') => {
    setUser(prev => ({
      ...prev,
      email,
      role: targetRole,
    }));
    setCurrentRole(targetRole);
    setAuthModalOpen(false);
    showToast('تم تسجيل الدخول بنجاح! مرحباً بك في استكشف.', 'success');
  };

  const logoutUser = () => {
    setCurrentRole('guest');
    showToast('تم تسجيل الخروج بنجاح.', 'success');
    navigate('home');
  };

  const openBookingModal = (trip: Trip) => {
    if (currentRole === 'guest') {
      openAuthModal('login');
      return;
    }
    setBookingModalTrip(trip);
  };

  const closeBookingModal = () => {
    setBookingModalTrip(null);
  };

  const openCancelModal = (b: Booking) => {
    setCancelModalBooking(b);
  };

  const closeCancelModal = () => {
    setCancelModalBooking(null);
  };

  const openRateModal = (b: Booking) => {
    setRateModalBooking(b);
  };

  const closeRateModal = () => {
    setRateModalBooking(null);
  };

  const toggleFavorite = (tripId: string) => {
    if (currentRole === 'guest') {
      openAuthModal('login');
      return;
    }
    setFavorites(prev => {
      const exists = prev.includes(tripId);
      if (exists) {
        return prev.filter(id => id !== tripId);
      } else {
        return [...prev, tripId];
      }
    });
  };

  const submitBooking = (bookingData: Omit<Booking, 'id' | 'bookedAt'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now().toString().slice(-4)}`,
      bookedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update seats in trip
    setTrips(prev =>
      prev.map(t => {
        if (t.id === newBooking.tripId) {
          const nextTaken = t.seatsTaken + newBooking.seatsCount;
          return {
            ...t,
            seatsTaken: nextTaken,
            status: nextTaken >= t.seatsTotal ? 'full' : t.status,
          };
        }
        return t;
      })
    );

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'تم حجز المقاعد بنجاح',
      body: `مقعدك محجوز لمدة 24 ساعة بانتظار تأكيد الدفع لرحلة ${newBooking.tripTitle}.`,
      type: 'booking',
      date: 'الآن',
      read: false,
      linkPage: 'booking-detail',
      linkId: newBooking.id,
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast('تم إرسال طلب الحجز وإشعار الدفع بنجاح!', 'success');
    return newBooking;
  };

  const cancelSeat = (bookingId: string, refundAmount: number) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'refund_pending',
          };
        }
        return b;
      })
    );
    closeCancelModal();
    showToast(`تم تقديم طلب إلغاء الحجز. العربون المسترجع: ${refundAmount.toLocaleString()} ل.س قيد الاسترجاع.`, 'success');
  };

  const submitRating = (tripId: string, tripStars: number, orgStars: number, comment: string) => {
    const newRating = {
      id: `r-${Date.now()}`,
      tripId,
      userId: user.id,
      userName: user.name,
      date: 'اليوم',
      tripStars,
      organizerStars: orgStars,
      comment,
    };

    setTrips(prev =>
      prev.map(t => {
        if (t.id === tripId) {
          return {
            ...t,
            ratings: [newRating, ...(t.ratings || [])],
          };
        }
        return t;
      })
    );

    closeRateModal();
    showToast('شكراً لمشاركتك! تم تسجيل تقييمك للرحلة والمنظم بنجاح.', 'success');
  };

  const submitQuestion = (tripId: string, questionText: string) => {
    if (currentRole === 'guest') {
      openAuthModal('login');
      return;
    }
    const newQ = {
      id: `q-${Date.now()}`,
      tripId,
      userId: user.id,
      userName: user.name,
      date: 'اليوم',
      question: questionText,
    };

    setTrips(prev =>
      prev.map(t => {
        if (t.id === tripId) {
          return {
            ...t,
            questions: [newQ, ...(t.questions || [])],
          };
        }
        return t;
      })
    );
    showToast('تم إرسال سؤالك للمنظم بنجاح، ستتلقى إشعاراً عند الرد.', 'success');
  };

  const answerQuestion = (tripId: string, questionId: string, answerText: string) => {
    setTrips(prev =>
      prev.map(t => {
        if (t.id === tripId) {
          return {
            ...t,
            questions: (t.questions || []).map(q =>
              q.id === questionId
                ? { ...q, answer: answerText, answeredAt: 'اليوم' }
                : q
            ),
          };
        }
        return t;
      })
    );
    showToast('تم نشر إجابتك على السؤال لجميع الزوار.', 'success');
  };

  const confirmPaymentAdmin = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'confirmed',
            organizerWhatsApp: '+963944112233',
            groupLink: 'https://chat.whatsapp.com/sample-istakshif-group',
          };
        }
        return b;
      })
    );
    showToast('تم قبول وتأكيد الدفعة بنجاح وتفعيل التواصل مع المنظم.', 'success');
  };

  const rejectPaymentAdmin = (bookingId: string, reason: string) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'pending_payment',
          };
        }
        return b;
      })
    );
    showToast(`تم رفض الدفعة بسبب: ${reason}. تم إشعار المغامر لإعادة الرفع.`, 'warning');
  };

  const approveVerificationAdmin = (orgId: string) => {
    setOrganizers(prev =>
      prev.map(org => {
        if (org.id === orgId) {
          return {
            ...org,
            status: 'approved',
            verified: true,
          };
        }
        return org;
      })
    );
    showToast('تم توثيق المنظم واعتماد الشارة الموثقة بنجاح.', 'success');
  };

  const rejectVerificationAdmin = (orgId: string, reason: string) => {
    setOrganizers(prev =>
      prev.map(org => {
        if (org.id === orgId) {
          return {
            ...org,
            status: 'rejected',
            rejectionReason: reason,
          };
        }
        return org;
      })
    );
    showToast(`تم رفض طلب التوثيق بسبب: ${reason}.`, 'warning');
  };

  const publishTripAdmin = (tripId: string) => {
    setTrips(prev =>
      prev.map(t => {
        if (t.id === tripId) {
          return {
            ...t,
            status: 'published',
          };
        }
        return t;
      })
    );
    showToast('تمت مراجعة الرحلة ونشرها بنجاح للجمهور.', 'success');
  };

  const createTripOrganizer = (newTripData: Partial<Trip>): Trip => {
    const fullTrip: Trip = {
      id: `trip-${Date.now().toString().slice(-4)}`,
      title: newTripData.title || 'رحلة جديدة',
      description: newTripData.description || '',
      fromGovernorateId: newTripData.fromGovernorateId || 'damascus',
      toGovernorateId: newTripData.toGovernorateId || 'latakia',
      startDate: newTripData.startDate || '2026-11-01',
      endDate: newTripData.endDate || '2026-11-02',
      durationText: newTripData.durationText || 'يومان',
      difficulty: newTripData.difficulty || 'medium',
      categories: newTripData.categories || ['nature_mountains'],
      meetingPoint: newTripData.meetingPoint || 'دمشق',
      transportType: newTripData.transportType || 'باص سياحي',
      included: newTripData.included || ['النقل والمبيت'],
      notIncluded: newTripData.notIncluded || ['المصاريف الشخصية'],
      whatToBring: newTripData.whatToBring || ['حذاء مريح'],
      minAge: newTripData.minAge || 16,
      maxAge: newTripData.maxAge || 55,
      pricePerPerson: newTripData.pricePerPerson || 150000,
      discountPrice: newTripData.discountPrice,
      seatsTotal: newTripData.seatsTotal || 20,
      seatsTaken: 0,
      minParticipants: newTripData.minParticipants || 10,
      minDeadlineHours: newTripData.minDeadlineHours || 72,
      whatsappNumber: newTripData.whatsappNumber || '+963944112233',
      groupLink: newTripData.groupLink || 'https://chat.whatsapp.com/sample',
      isFeatured: false,
      status: 'published',
      organizerId: 'org-1',
      organizerName: 'فريق بردى للمغامرات الجبلية',
      organizerVerified: true,
      organizerRating: 4.9,
      organizerTripsCount: 25,
      images: [
        '/src/assets/images/syria_mountains_qalamoun_1790855700994.jpg',
        '/src/assets/images/syria_latakia_coast_1790855725363.jpg',
      ],
      dailyProgram: newTripData.dailyProgram || [
        { day: 1, title: 'الانطلاق والمخيم', description: 'التجمع وبدء النشاط' },
      ],
      ratings: [],
      questions: [],
      cancellationPolicyShort: 'استرداد العربون كاملاً حتى 48 ساعة قبل انطلاق الرحلة.',
    };

    setTrips(prev => [fullTrip, ...prev]);
    showToast('تم إنشاء الرحلة ونشرها بنجاح!', 'success');
    return fullTrip;
  };

  const updateAttendanceOrganizer = (tripId: string, noShowUserIds: string[]) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.tripId === tripId) {
          const isNoShow = noShowUserIds.includes(b.id);
          return {
            ...b,
            attendedStatus: isNoShow ? 'no_show' : 'attended',
            status: isNoShow ? 'no_show' : 'attended',
          };
        }
        return b;
      })
    );
    showToast('تم حفظ سجل الحضور والغياب للرحلة بنجاح.', 'success');
  };

  const submitUpgradeOrganizer = (data: { orgName: string; description: string; phone: string; governorates: string[] }) => {
    const newOrg: OrganizerProfile = {
      id: `org-${Date.now().toString().slice(-4)}`,
      userId: user.id,
      orgName: data.orgName,
      logo: '/src/assets/images/syria_damascus_courtyard_1790855748446.jpg',
      description: data.description,
      governorates: data.governorates,
      verified: false,
      tripsCount: 0,
      rating: 5.0,
      joinedDate: 'اليوم',
      strikesCount: 0,
      status: 'pending',
      reviewedTripsCount: 0,
    };

    setOrganizers(prev => [...prev, newOrg]);
    showToast('تم إرسال طلب الترقية إلى منظم بنجاح. حسابك قيد المراجعة.', 'success');
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('تم حفظ إعدادات المنصة بنجاح.', 'success');
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        currentRole,
        setCurrentRole,
        currentPage,
        pageParams,
        navigate,
        trips,
        organizers,
        bookings,
        user,
        favorites,
        notifications,
        settings,
        updateSettings,
        toasts,
        showToast,
        dismissToast,
        authModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
        loginUser,
        logoutUser,
        bookingModalTrip,
        openBookingModal,
        closeBookingModal,
        cancelModalBooking,
        openCancelModal,
        closeCancelModal,
        rateModalBooking,
        openRateModal,
        closeRateModal,
        toggleFavorite,
        submitBooking,
        cancelSeat,
        submitRating,
        submitQuestion,
        answerQuestion,
        confirmPaymentAdmin,
        rejectPaymentAdmin,
        approveVerificationAdmin,
        rejectVerificationAdmin,
        publishTripAdmin,
        createTripOrganizer,
        updateAttendanceOrganizer,
        submitUpgradeOrganizer,
        markNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
