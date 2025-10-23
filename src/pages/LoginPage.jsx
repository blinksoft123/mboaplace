
import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet';
    import { Link } from 'react-router-dom';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { Loader2 } from 'lucide-react';

    const LoginPage = () => {
      const { signIn, signInWithProvider, loading: authLoading } = useAuth();
      const [formLoading, setFormLoading] = useState(false);
      const [errorMessage, setErrorMessage] = useState('');

      const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setErrorMessage('');
        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData.entries());

        const { error } = await signIn(email, password);

        if (error) {
          setErrorMessage(error.message.includes('Invalid login credentials') ? 'Email ou mot de passe incorrect.' : "Une erreur est survenue.");
        }
        setFormLoading(false);
      };
      
      const handleProviderSignIn = async (provider) => {
        setFormLoading(true);
        await signInWithProvider(provider);
        setFormLoading(false);
      };
      
      if (authLoading) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Loader2 className="h-12 w-12 animate-spin text-green-700 mb-4" />
            <p className="text-lg text-gray-600">Connexion en cours...</p>
          </div>
        );
      }

      return (
        <>
          <Helmet>
            <title>Connexion - MBOA PLACE</title>
            <meta name="description" content="Connectez-vous à votre compte MBOA PLACE." />
          </Helmet>
          <div className="min-h-full flex">
            <div className="hidden lg:block relative w-0 flex-1">
              <img className="absolute inset-0 h-full w-full object-cover" alt="Artistic map of Africa with faces of people" src="https://horizons-cdn.hostinger.com/f2897423-192d-4a23-9582-daae7dc593d2/8f3a5b76a8b159217e147cc6969bc2f4.png" />
              <div className="absolute inset-0 bg-green-900 bg-opacity-60 flex flex-col justify-end p-12">
                <h2 className="text-4xl font-bold text-white text-shadow">La force de la communauté.</h2>
                <p className="text-white text-lg mt-4 text-shadow">Rejoignez des milliers de membres et commencez à échanger.</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
              <div className="mx-auto w-full max-w-sm lg:w-96">
                <div>
                  <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Bon retour sur MBOA PLACE !</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Pas encore membre?{' '}
                    <Link to="/inscription" className="font-medium text-[#1B5E20] hover:text-[#2E7D32]">
                      Créer un compte
                    </Link>
                  </p>
                </div>

                <div className="mt-8">
                  <div className="mt-6">
                    {/* Message de sécurité */}
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-green-800">Connexion 100% sécurisée</p>
                          <p className="text-xs text-green-700 mt-1">
                            Nous utilisons les systèmes d'authentification officiels de Google pour protéger votre compte.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <button onClick={() => handleProviderSignIn('google')} disabled={formLoading} className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          <span>Google</span>
                        </button>
                      </div>
                      <div>
                        <button onClick={() => handleProviderSignIn('facebook')} disabled={formLoading} className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                          </svg>
                          <span>Facebook</span>
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300" /></div>
                      <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">OU</span></div>
                    </div>
                    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                      {errorMessage && (
                        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                          {errorMessage}
                        </div>
                      )}
                      <input name="email" type="email" required placeholder="Email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
                      <input name="password" type="password" required placeholder="Mot de passe" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center"><input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#1B5E20] focus:ring-[#1B5E20] border-gray-300 rounded" /><label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Rester connecté</label></div>
                        <div className="text-sm"><Link to="/reset-password" className="font-medium text-[#1B5E20] hover:text-[#2E7D32]">Mot de passe oublié ?</Link></div>
                      </div>
                      <button type="submit" disabled={formLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1B5E20] hover:bg-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B5E20] disabled:opacity-50">
                        {formLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'SE CONNECTER'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    };

    export default LoginPage;
  