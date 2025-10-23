
import React from 'react';
    import { Routes, Route, Navigate } from 'react-router-dom';
    import Header from '@/components/layout/Header';
    import Footer from '@/components/layout/Footer';
    import HomePage from '@/pages/HomePage';
    import CategoriesPage from '@/pages/CategoriesPage';
    import CategoryDetailPage from '@/pages/CategoryDetailPage';
    import AnnonceDetailPage from '@/pages/AnnonceDetailPage';
    import LoginPage from '@/pages/LoginPage';
    import RegisterPage from '@/pages/RegisterPage';
    import ResetPasswordPage from '@/pages/ResetPasswordPage';
    import ProfilePage from '@/pages/ProfilePage';
    import MyAnnoncesPage from '@/pages/MyAnnoncesPage';
    import CommentCaMarchePage from '@/pages/CommentCaMarchePage';
    import SecuritePage from '@/pages/SecuritePage';
    import ContactPage from '@/pages/ContactPage';
    import CGUPage from '@/pages/CGUPage';
    import PremiumPage from '@/pages/PremiumPage';
    import SearchPage from '@/pages/SearchPage';
    import SearchResultsPage from '@/pages/SearchResultsPage';
    import QuiSommesNousPage from '@/pages/QuiSommesNousPage';
    import NotreMissionPage from '@/pages/NotreMissionPage';
    import FAQPage from '@/pages/FAQPage';
    import ConfirmationPage from '@/pages/ConfirmationPage';
    import CheckEmailPage from '@/pages/CheckEmailPage';
    import MessagesPage from '@/pages/MessagesPage';
    import MyReviewsPage from '@/pages/MyReviewsPage';
    import MyFavoritesPage from '@/pages/MyFavoritesPage';
    import EditProfilePage from '@/pages/EditProfilePage';
    import SettingsPage from '@/pages/SettingsPage';
    import PublishPage from '@/pages/PublishPage';
    import EditAnnoncePage from '@/pages/EditAnnoncePage';
    import AdminDashboardPage from '@/pages/AdminDashboardPage';
    import ReportsPage from '@/pages/ReportsPage';
    import { useAuth } from './contexts/SupabaseAuthContext';
    import { Loader2 } from 'lucide-react';
    import ScrollToTop from '@/components/ScrollToTop';
    import { Toaster } from '@/components/ui/toaster';
    import ErrorBoundary from '@/components/ErrorBoundary';

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
            </main>
            <Toaster />
            <Footer />
          </div>
        </ErrorBoundary>
      );
    }

    export default App;
