
import React, { lazy, Suspense } from 'react';
    import { Routes, Route, Navigate } from 'react-router-dom';
    import Header from '@/components/layout/Header';
    import Footer from '@/components/layout/Footer';
    import { useAuth } from './contexts/SupabaseAuthContext';
    import { Loader2 } from 'lucide-react';
    import ScrollToTop from '@/components/ScrollToTop';
    import { Toaster } from '@/components/ui/toaster';
    import ErrorBoundary from '@/components/ErrorBoundary';

    // Lazy load all pages for code splitting
    const HomePage = lazy(() => import('@/pages/HomePage'));
    const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'));
    const CategoryDetailPage = lazy(() => import('@/pages/CategoryDetailPage'));
    const AnnonceDetailPage = lazy(() => import('@/pages/AnnonceDetailPage'));
    const LoginPage = lazy(() => import('@/pages/LoginPage'));
    const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
    const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
    const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
    const MyAnnoncesPage = lazy(() => import('@/pages/MyAnnoncesPage'));
    const CommentCaMarchePage = lazy(() => import('@/pages/CommentCaMarchePage'));
    const SecuritePage = lazy(() => import('@/pages/SecuritePage'));
    const ContactPage = lazy(() => import('@/pages/ContactPage'));
    const CGUPage = lazy(() => import('@/pages/CGUPage'));
    const PremiumPage = lazy(() => import('@/pages/PremiumPage'));
    const SearchPage = lazy(() => import('@/pages/SearchPage'));
    const SearchResultsPage = lazy(() => import('@/pages/SearchResultsPage'));
    const QuiSommesNousPage = lazy(() => import('@/pages/QuiSommesNousPage'));
    const NotreMissionPage = lazy(() => import('@/pages/NotreMissionPage'));
    const FAQPage = lazy(() => import('@/pages/FAQPage'));
    const ConfirmationPage = lazy(() => import('@/pages/ConfirmationPage'));
    const CheckEmailPage = lazy(() => import('@/pages/CheckEmailPage'));
    const MessagesPage = lazy(() => import('@/pages/MessagesPage'));
    const MyReviewsPage = lazy(() => import('@/pages/MyReviewsPage'));
    const MyFavoritesPage = lazy(() => import('@/pages/MyFavoritesPage'));
    const EditProfilePage = lazy(() => import('@/pages/EditProfilePage'));
    const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
    const PublishPage = lazy(() => import('@/pages/PublishPage'));
    const EditAnnoncePage = lazy(() => import('@/pages/EditAnnoncePage'));
    const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
    const ReportsPage = lazy(() => import('@/pages/ReportsPage'));

    const AuthGuard = ({ children }) => {
        const { user, loading } = useAuth();
        if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
        return user ? children : <Navigate to="/connexion" replace />;
    };
    
    const AdminGuard = ({ children }) => {
        const { user, profile, loading } = useAuth();
        if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
        return user && profile?.role === 'admin' ? children : <Navigate to="/profil" replace />;
    };

    const PublicOnlyGuard = ({ children }) => {
      const { user, loading } = useAuth();
      if (loading) return null;
      return !user ? children : <Navigate to="/profil" replace />;
    };

    function App() {
      const { loading } = useAuth();

      if (loading) {
        return (
          <div className="h-screen flex items-center justify-center bg-white">
            <Loader2 className="h-12 w-12 animate-spin text-[#1B5E20]" />
          </div>
        )
      }

      return (
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <ScrollToTop />
            <Header />
            <main className="flex-grow pt-[70px]">
              <Suspense fallback={
                <div className="flex justify-center items-center h-screen">
                  <Loader2 className="h-12 w-12 animate-spin text-[#1B5E20]" />
                </div>
              }>
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categorie/:slug" element={<CategoryDetailPage />} />
              <Route path="/annonce/:id" element={<AnnonceDetailPage />} />
              
              <Route path="/connexion" element={<PublicOnlyGuard><LoginPage /></PublicOnlyGuard>} />
              <Route path="/inscription" element={<PublicOnlyGuard><RegisterPage /></PublicOnlyGuard>} />
              <Route path="/reset-password" element={<PublicOnlyGuard><ResetPasswordPage /></PublicOnlyGuard>} />

              <Route path="/confirmation" element={<ConfirmationPage />} />
              <Route path="/verifier-email" element={<CheckEmailPage />} />

              <Route path="/publier" element={<AuthGuard><PublishPage /></AuthGuard>} />
              <Route path="/annonce/edit/:id" element={<AuthGuard><EditAnnoncePage /></AuthGuard>} />
              <Route path="/profil" element={<AuthGuard><ProfilePage /></AuthGuard>} />
              <Route path="/profil/mes-annonces" element={<AuthGuard><MyAnnoncesPage /></AuthGuard>} />
              <Route path="/profil/messages" element={<AuthGuard><MessagesPage /></AuthGuard>} />
              <Route path="/profil/avis" element={<AuthGuard><MyReviewsPage /></AuthGuard>} />
              <Route path="/profil/favoris" element={<AuthGuard><MyFavoritesPage /></AuthGuard>} />
              <Route path="/profil/modifier" element={<AuthGuard><EditProfilePage /></AuthGuard>} />
              <Route path="/profil/parametres" element={<AuthGuard><SettingsPage /></AuthGuard>} />
              
              <Route path="/admin" element={<AdminGuard><AdminDashboardPage /></AdminGuard>} />
              <Route path="/admin/signalements" element={<AdminGuard><ReportsPage /></AdminGuard>} />

              <Route path="/comment-ca-marche" element={<CommentCaMarchePage />} />
              <Route path="/securite" element={<SecuritePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cgu" element={<CGUPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/recherche" element={<SearchPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/qui-sommes-nous" element={<QuiSommesNousPage />} />
              <Route path="/notre-mission" element={<NotreMissionPage />} />
              <Route path="/faq" element={<FAQPage />} />
              </Routes>
              </Suspense>
            </main>
            <Toaster />
            <Footer />
          </div>
        </ErrorBoundary>
      );
    }

    export default App;
