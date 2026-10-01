import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/common/AuthModal';
import { BookingModal } from './components/adventurer/BookingModal';
import { CancelBookingModal } from './components/adventurer/CancelBookingModal';
import { RateTripModal } from './components/adventurer/RateTripModal';

// Adventurer Views
import { HomeView } from './views/adventurer/HomeView';
import { TripsView } from './views/adventurer/TripsView';
import { TripDetailView } from './views/adventurer/TripDetailView';
import { OrganizersView } from './views/adventurer/OrganizersView';
import { OrganizerDetailView } from './views/adventurer/OrganizerDetailView';
import { MyBookingsView } from './views/adventurer/MyBookingsView';
import { BookingDetailView } from './views/adventurer/BookingDetailView';
import { ProfileView } from './views/adventurer/ProfileView';
import { UpgradeOrganizerView } from './views/adventurer/UpgradeOrganizerView';
import { NotificationsView } from './views/adventurer/NotificationsView';
import { StaticPagesView } from './views/adventurer/StaticPagesView';

// Organizer Views & Layout
import { OrganizerLayout } from './views/organizer/OrganizerLayout';
import { OrgOverviewView } from './views/organizer/OrgOverviewView';
import { OrgTripsView } from './views/organizer/OrgTripsView';
import { OrgCreateTripView } from './views/organizer/OrgCreateTripView';
import { OrgBookingsView } from './views/organizer/OrgBookingsView';
import { OrgAttendanceView } from './views/organizer/OrgAttendanceView';
import { OrgEarningsView } from './views/organizer/OrgEarningsView';
import { OrgQuestionsView } from './views/organizer/OrgQuestionsView';
import { OrgPublicPageView } from './views/organizer/OrgPublicPageView';
import { OrgWarningsView } from './views/organizer/OrgWarningsView';

// Admin Views & Layout
import { AdminLayout } from './views/admin/AdminLayout';
import { AdminOverviewView } from './views/admin/AdminOverviewView';
import { AdminPaymentsView } from './views/admin/AdminPaymentsView';
import { AdminVerificationsView } from './views/admin/AdminVerificationsView';
import { AdminTripsView } from './views/admin/AdminTripsView';
import { AdminSettingsView } from './views/admin/AdminSettingsView';

const MainAppContent: React.FC = () => {
  const { currentPage, currentRole } = useApp();

  // Route to render
  const renderView = () => {
    switch (currentPage) {
      // Adventurer / Guest pages
      case 'home':
        return <HomeView />;
      case 'trips':
        return <TripsView />;
      case 'trip-detail':
        return <TripDetailView />;
      case 'organizers':
        return <OrganizersView />;
      case 'organizer-detail':
        return <OrganizerDetailView />;
      case 'my-bookings':
        return <MyBookingsView />;
      case 'booking-detail':
        return <BookingDetailView />;
      case 'favorites':
        return <ProfileView />;
      case 'profile':
        return <ProfileView />;
      case 'upgrade-organizer':
        return <UpgradeOrganizerView />;
      case 'notifications':
        return <NotificationsView />;
      case 'faq':
        return <StaticPagesView pageType="faq" />;
      case 'contact':
        return <StaticPagesView pageType="contact" />;
      case 'terms':
        return <StaticPagesView pageType="terms" />;
      case 'privacy':
        return <StaticPagesView pageType="privacy" />;
      case 'cancellation':
        return <StaticPagesView pageType="cancellation" />;

      // Organizer pages
      case 'org-overview':
        return <OrgOverviewView />;
      case 'org-trips':
        return <OrgTripsView />;
      case 'org-create-trip':
        return <OrgCreateTripView />;
      case 'org-bookings':
        return <OrgBookingsView />;
      case 'org-attendance':
        return <OrgAttendanceView />;
      case 'org-earnings':
        return <OrgEarningsView />;
      case 'org-questions':
        return <OrgQuestionsView />;
      case 'org-public-page':
        return <OrgPublicPageView />;
      case 'org-warnings':
        return <OrgWarningsView />;

      // Admin pages
      case 'admin-overview':
        return <AdminOverviewView />;
      case 'admin-payments':
        return <AdminPaymentsView />;
      case 'admin-verifications':
        return <AdminVerificationsView />;
      case 'admin-trips':
        return <AdminTripsView />;
      case 'admin-settings':
        return <AdminSettingsView />;

      default:
        return <HomeView />;
    }
  };

  const isOrganizerPage = currentPage.startsWith('org-');
  const isAdminPage = currentPage.startsWith('admin-');

  return (
    <div className="min-h-screen bg-[#F6F1EA] dark:bg-[#0A2E36] text-[#0A2E36] dark:text-[#F4EFE6] flex flex-col font-tajawal transition-colors duration-200">
      {isAdminPage ? (
        <AdminLayout>{renderView()}</AdminLayout>
      ) : isOrganizerPage ? (
        <OrganizerLayout>{renderView()}</OrganizerLayout>
      ) : (
        <>
          <Header />
          <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-6">
            {renderView()}
          </main>
          <Footer />
        </>
      )}

      {/* Global Overlays & Modals */}
      <AuthModal />
      <BookingModal />
      <CancelBookingModal />
      <RateTripModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
