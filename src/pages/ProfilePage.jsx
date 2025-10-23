
    import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { LayoutDashboard, FileText, Heart, MessageCircle, Star, User, Settings, LogOut, Eye, TrendingUp, Loader2, Shield } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { supabase } from '@/lib/customSupabaseClient';

    const ProfilePage = () => {
      const { toast } = useToast();
      const { user, profile, signOut, loading: authLoading } = useAuth();
      const [stats, setStats] = useState({
        activeAnnonces: 0,
        views: 0,
        unreadMessages: 0,
        avgRating: 0,
      });
      const [statsLoading, setStatsLoading] = useState(true);
      const [annonces, setAnnonces] = useState([]);

      useEffect(() => {
        const fetchDashboardData = async () => {
          if (!user) {
            setStatsLoading(false);
            return;
          }
          setStatsLoading(true);

          try {
            // Parallelize all API calls
            const [annoncesResult, conversationsResult, reviewsResult] = await Promise.all([
              supabase.from('annonces').select(`
                *,
                profiles!seller_id (full_name, avatar_url)
              `, { count: 'exact' }).eq('seller_id', user.id).eq('status', 'active'),
              supabase.from('conversations').select('id').or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`),
              supabase.from('reviews').select('rating').eq('reviewed_id', user.id)
            ]);

            // Process annonces
            if (annoncesResult.error) {
              console.error('Error fetching annonces:', annoncesResult.error);
            } else {
              setAnnonces(annoncesResult.data || []);
              const totalViews = (annoncesResult.data || []).reduce((acc, ad) => acc + (ad.views || 0), 0);
              setStats(prev => ({ ...prev, activeAnnonces: annoncesResult.data?.length || 0, views: totalViews }));
            }

            // Process conversations and messages
            if (conversationsResult.error) {
              console.error('Error fetching conversations:', conversationsResult.error);
              setStats(prev => ({ ...prev, unreadMessages: 0 }));
            } else if (conversationsResult.data && conversationsResult.data.length > 0) {
              const conversationIds = conversationsResult.data.map(c => c.id);
              const { count: unreadCount, error: messagesError } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('is_read', false)
                .in('conversation_id', conversationIds)
                .not('sender_id', 'eq', user.id);

              if (!messagesError) {
                setStats(prev => ({ ...prev, unreadMessages: unreadCount || 0 }));
              } else {
                console.error('Error fetching unread messages:', messagesError);
                setStats(prev => ({ ...prev, unreadMessages: 0 }));
              }
            } else {
              setStats(prev => ({ ...prev, unreadMessages: 0 }));
            }

            // Process reviews
            if (reviewsResult.error) {
              console.error('Error fetching reviews:', reviewsResult.error);
              setStats(prev => ({ ...prev, avgRating: 0 }));
            } else if (reviewsResult.data && reviewsResult.data.length > 0) {
              const avg = reviewsResult.data.reduce((acc, r) => acc + r.rating, 0) / reviewsResult.data.length;
              setStats(prev => ({ ...prev, avgRating: avg.toFixed(1) }));
            } else {
              setStats(prev => ({ ...prev, avgRating: 0 }));
            }
          } catch (error) {
            console.error('Error fetching dashboard data:', error);
          } finally {
            setStatsLoading(false);
          }
        };

        if (!authLoading) {
            fetchDashboardData();
        }
      }, [user, authLoading]);

      const handleSignOut = async () => {
        await signOut();
        toast({ title: 'Vous avez été déconnecté.' });
      };
      
      if (authLoading) {
        return (
          <div className="h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#1B5E20]" />
          </div>
        );
      }

      return (
        <>
          <Helmet>
            <title>Mon profil - MBOA PLACE</title>
            <meta name="description" content="Gérez votre compte et vos annonces sur MBOA PLACE" />
          </Helmet>

          <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                    <div className="text-center mb-6">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                      ) : (
                        <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-3xl font-bold">
                          {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <h2 className="text-xl font-bold">{profile?.full_name || 'Utilisateur'}</h2>
                      <div className="flex items-center justify-center space-x-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < Math.round(stats.avgRating) ? "text-yellow-400 fill-current" : "text-gray-300"} />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">({stats.avgRating})</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Membre depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : 'N/A'}</p>
                    </div>

                    <nav className="space-y-2">
                      <Link to="/profil" className="flex items-center space-x-3 px-4 py-3 bg-gray-100 rounded-lg"><LayoutDashboard size={20} /><span>Tableau de bord</span></Link>
                      <Link to="/profil/mes-annonces" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition"><FileText size={20} /><span>Mes annonces</span></Link>
                      <Link to="/profil/favoris" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition"><Heart size={20} /><span>Mes favoris</span></Link>
                      <Link to="/profil/messages" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition relative"><MessageCircle size={20} /><span>Messages</span>{stats.unreadMessages > 0 && <span className="absolute right-2 top-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{stats.unreadMessages}</span>}</Link>
                      <Link to="/profil/avis" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition"><Star size={20} /><span>Mes avis</span></Link>
                      <Link to="/profil/modifier" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition"><User size={20} /><span>Mon profil</span></Link>
                      <Link to="/profil/parametres" className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition"><Settings size={20} /><span>Paramètres</span></Link>
                      {profile?.role === 'admin' && (
                        <Link to="/admin" className="flex items-center space-x-3 px-4 py-3 bg-green-700 text-white rounded-lg transition"><Shield size={20} /><span>Admin</span></Link>
                      )}
                      <button onClick={handleSignOut} className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition text-left text-red-600"><LogOut size={20} /><span>Déconnexion</span></button>
                    </nav>
                  </div>
                </aside>

                <main className="lg:col-span-3">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold mb-8">Bienvenue {profile?.full_name || 'sur votre profil'} !</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      {statsLoading ? Array(4).fill(0).map((_, i) => <div key={i} className="bg-white rounded-lg shadow-md p-6 h-28 animate-pulse"></div>) : (
                        <>
                          <div className="bg-white rounded-lg shadow-md p-6"><div className="flex items-center justify-between mb-2"><FileText size={24} className="text-[#1B5E20]" /><span className="text-3xl font-bold">{stats.activeAnnonces}</span></div><p className="text-gray-600">Annonces actives</p></div>
                          <div className="bg-white rounded-lg shadow-md p-6"><div className="flex items-center justify-between mb-2"><Eye size={24} className="text-blue-500" /><span className="text-3xl font-bold">{stats.views}</span></div><p className="text-gray-600">Vues totales</p></div>
                          <div className="bg-white rounded-lg shadow-md p-6"><div className="flex items-center justify-between mb-2"><MessageCircle size={24} className="text-orange-500" /><span className="text-3xl font-bold">{stats.unreadMessages}</span></div><p className="text-gray-600">Messages non lus</p></div>
                          <div className="bg-white rounded-lg shadow-md p-6"><div className="flex items-center justify-between mb-2"><Star size={24} className="text-yellow-400" /><span className="text-3xl font-bold">{stats.avgRating}</span></div><p className="text-gray-600">Note moyenne</p></div>
                        </>
                      )}
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                      <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold">Mes annonces actives</h2><Link to="/publier" className="text-[#FF6F00] font-semibold hover:underline">+ Publier nouvelle annonce</Link></div>
                      {statsLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div> : annonces.length === 0 ? (
                        <div className="text-center py-10"><p className="text-gray-500">Vous n'avez aucune annonce active pour le moment.</p></div>
                      ) : (
                        <div className="space-y-4">
                          {annonces.slice(0, 3).map(ad => (
                            <div key={ad.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                              <div className="flex items-center gap-4">
                                <img src={ad.images_urls?.[0] || 'https://placehold.co/64x64'} alt={ad.title} className="w-16 h-16 object-cover rounded-md" />
                                <div>
                                  <Link to={`/annonce/${ad.id}`} className="font-bold hover:underline">{ad.title}</Link>
                                  <p className="text-sm text-gray-500">{ad.city}</p>
                                </div>
                              </div>
                              <Link to={`/annonce/${ad.id}`} className="text-sm font-semibold text-[#1B5E20]">Voir</Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow-lg p-8 text-center">
                      <div className="w-16 h-16 bg-[#FF6F00] rounded-full flex items-center justify-center mx-auto mb-4"><TrendingUp size={32} className="text-white" /></div>
                      <h3 className="text-2xl font-bold mb-2">💎 Passez Premium !</h3>
                      <p className="text-gray-700 mb-4">Annonces illimitées, remontées auto, badge vérifié et bien plus !</p>
                      <Link to="/premium" className="inline-block bg-[#FF6F00] hover:bg-[#E65100] text-white px-8 py-3 rounded-lg font-bold transition">En savoir plus</Link>
                    </div>
                  </motion.div>
                </main>
              </div>
            </div>
          </div>
        </>
      );
    };

    export default ProfilePage;
  