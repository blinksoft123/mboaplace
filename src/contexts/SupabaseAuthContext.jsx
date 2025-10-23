
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    import { useToast } from '@/components/ui/use-toast';
    import { useNavigate } from 'react-router-dom';

    const AuthContext = createContext(undefined);

    export const AuthProvider = ({ children }) => {
      const { toast } = useToast();
      const navigate = useNavigate();

      const [user, setUser] = useState(null);
      const [profile, setProfile] = useState(null);
      const [session, setSession] = useState(null);
      const [loading, setLoading] = useState(true);

      const fetchProfile = useCallback(async (userId) => {
        if (!userId) {
          setProfile(null);
          return null;
        }
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error("Error fetching profile:", error);
            setProfile(null);
            return null;
          }
          setProfile(data);
          return data;
        } catch (e) {
            console.error("Exception fetching profile:", e);
            setProfile(null);
            return null;
        }
      }, []);
      
      useEffect(() => {
        const initializeSession = async () => {
          try {
            // Check if we have a hash in the URL (OAuth callback)
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const hasOAuthCallback = hashParams.has('access_token');
            
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            setSession(currentSession);
            const currentUser = currentSession?.user ?? null;
            setUser(currentUser);
            
            if (currentUser) {
              await fetchProfile(currentUser.id);
              
              // If we have OAuth callback, redirect to profile and clean URL
              if (hasOAuthCallback) {
                // Clean the hash from URL
                window.history.replaceState({}, document.title, window.location.pathname);
                navigate('/profil', { replace: true });
              }
            }
          } catch(e) {
            console.error("Error initializing session", e);
          } finally {
            setLoading(false);
          }
        };

        initializeSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log('Auth state changed:', event, newSession?.user?.email);
          setSession(newSession);
          const currentUser = newSession?.user ?? null;
          setUser(currentUser);
          
          if (currentUser) {
            setLoading(true);
            await fetchProfile(currentUser.id);
            setLoading(false);
          } else {
            setProfile(null);
          }
          
          // Handle redirections based on auth events
          if (event === 'SIGNED_IN') {
            // Clean hash if present
            if (window.location.hash) {
              window.history.replaceState({}, document.title, window.location.pathname);
            }
            navigate('/profil', { replace: true });
          } else if (event === 'SIGNED_OUT') {
            navigate('/', { replace: true });
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      }, [navigate, fetchProfile]);

      const handleApiError = (error, defaultMessage) => {
        let description = defaultMessage;
        if (error.message.includes('rate limit') || error.message.includes('over_request_rate_limit')) {
            description = "Le service est momentanément saturé, veuillez réessayer dans quelques secondes.";
        } else if (error.message.includes('Invalid login credentials')) {
            description = "Email ou mot de passe incorrect.";
        }
        
        toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message || description,
        });
        console.error("API Error:", error);
      };

      const signUp = useCallback(async (email, password, options) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            ...options,
            emailRedirectTo: `${window.location.origin}/confirmation`,
          }
        });
        
        if (error) {
          handleApiError(error, "Quelque chose s'est mal passé lors de l'inscription.");
          return { error };
        } 
        
        if (data.user) {
            // Mettre à jour le profil avec toutes les données d'inscription
            const { error: profileError } = await supabase.from('profiles').update({
                full_name: options.data.full_name,
                phone: options.data.phone,
                city: options.data.city,
                country: options.data.country,
                latitude: options.data.latitude,
                longitude: options.data.longitude,
            }).eq('id', data.user.id);
            
            if (profileError) {
                handleApiError(profileError, "Erreur lors de la mise à jour du profil.");
            } else {
                toast({
                    title: "Inscription réussie !",
                    description: "Veuillez vérifier votre email pour confirmer votre compte.",
                });
                navigate('/verifier-email');
            }
            return { error: profileError };
        }
        return { error };
      }, [navigate, toast]);

      const signIn = useCallback(async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          handleApiError(error, "Email ou mot de passe incorrect.");
        }
        return { error };
      }, []);

      const signInWithProvider = useCallback(async (provider) => {
        // Use current window location for redirect to avoid showing Supabase URL
        const redirectUrl = `${window.location.origin}/profil`;
        
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: redirectUrl,
            skipBrowserRedirect: false,
          },
        });

        if (error) {
          // Specific error messages for different providers
          let errorMessage = "Impossible de se connecter avec ce fournisseur.";
          
          if (provider === 'facebook') {
            errorMessage = "La connexion Facebook n'est pas encore configurée. Veuillez utiliser Google ou votre email.";
          } else if (error.message.includes('not enabled')) {
            errorMessage = `La connexion via ${provider} n'est pas activée. Veuillez contacter le support.`;
          }
          
          toast({
            variant: "destructive",
            title: "Erreur d'authentification",
            description: errorMessage,
          });
          console.error(`OAuth Error (${provider}):`, error);
        }
      }, [toast]);

      const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSession(null);
      }, []);

      const value = {
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signInWithProvider,
        signOut,
      };

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };
