import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';
import CityAutocomplete from '@/components/CityAutocomplete';
import { PASSWORD_STRENGTH } from '@/constants';
const RegisterPage = () => {
  const {
    toast
  } = useToast();
  const {
    signUp,
    signInWithProvider
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [location, setLocation] = useState(null);
  const checkPasswordStrength = pass => {
    let strength = 0;
    if (pass.length > 7) strength++;
    if (pass.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength++;
    if (pass.match(/([0-9])/)) strength++;
    if (pass.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength++;
    setPasswordStrength(strength);
  };
  const handlePasswordChange = e => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };
  const handleProviderSignIn = async provider => {
    setLoading(true);
    await signInWithProvider(provider);
    setLoading(false);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    if (data.password !== data['confirm-password']) {
      toast({
        variant: 'destructive',
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas."
      });
      setLoading(false);
      return;
    }
    if (!location) {
      toast({
        variant: 'destructive',
        title: "Erreur",
        description: "Veuillez sélectionner une ville dans la liste."
      });
      setLoading(false);
      return;
    }
    await signUp(data.email, data.password, {
      data: {
        full_name: `${data['first-name']} ${data['last-name']}`,
        phone: data.phone,
        ...location
      }
    });
    setLoading(false);
  };
  const strengthIndicator = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return PASSWORD_STRENGTH.WEAK;
      case 2:
        return PASSWORD_STRENGTH.MEDIUM;
      case 3:
        return PASSWORD_STRENGTH.STRONG;
      case 4:
        return PASSWORD_STRENGTH.VERY_STRONG;
      default:
        return {
          label: '',
          color: 'bg-gray-200',
          textColor: 'text-gray-500',
          width: '0%'
        };
    }
  };
  return <>
          <Helmet>
            <title>Inscription - MBOA PLACE</title>
            <meta name="description" content="Créez votre compte gratuit sur MBOA PLACE." />
          </Helmet>
          <div className="min-h-full flex">
            <div className="hidden lg:block relative w-0 flex-1">
              <img className="absolute inset-0 h-full w-full object-cover" alt="African community smiling and interacting" src="https://horizons-cdn.hostinger.com/f2897423-192d-4a23-9582-daae7dc593d2/e4e273c21b39ff3dc12036b0b15ddc1c.png" />
              <div className="absolute inset-0 bg-green-900 bg-opacity-60 flex flex-col justify-end p-12">
                <h2 className="text-4xl font-bold text-white">Rejoignez MBOA PLACE</h2>
                <p className="text-white text-lg mt-4">La plus grande communauté d'échange pour l'Afrique et la diaspora africaine.</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
              <div className="mx-auto w-full max-w-sm lg:w-96">
                <div>
                  <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Créer un compte gratuit</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Déjà membre?{' '}
                    <Link to="/connexion" className="font-medium text-[#1B5E20] hover:text-[#2E7D32]">
                      Se connecter
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
                          <p className="text-sm font-semibold text-green-800">Inscription 100% sécurisée</p>
                          <p className="text-xs text-green-700 mt-1">
                            Nous utilisons les systèmes d'authentification officiels de Google pour protéger votre compte.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <button onClick={() => handleProviderSignIn('google')} disabled={loading} className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition">
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
                        <button onClick={() => handleProviderSignIn('facebook')} disabled={loading} className="w-full inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition">
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
                      <div className="grid grid-cols-2 gap-4">
                        <input name="first-name" type="text" required placeholder="Prénom" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
                        <input name="last-name" type="text" required placeholder="Nom" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
                      </div>
                      <input name="email" type="email" required placeholder="Email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
                      <input name="phone" type="tel" placeholder="Téléphone (+1)" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
                      <CityAutocomplete onSelect={setLocation} />
                      <div>
                        <input name="password" type="password" required placeholder="Mot de passe" value={password} onChange={handlePasswordChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
                        {password.length > 0 && <div className="mt-2">
                            <div className="h-2 w-full bg-gray-200 rounded">
                              <div className={`h-2 rounded ${strengthIndicator().color}`} style={{
                        width: strengthIndicator().width
                      }}></div>
                            </div>
                            <p className={`text-xs mt-1 ${strengthIndicator().textColor}`}>{strengthIndicator().label}</p>
                          </div>}
                      </div>
                      <input name="confirm-password" type="password" required placeholder="Confirmer mot de passe" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
                      <div className="space-y-2">
                        <div className="flex items-start"><input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-[#1B5E20] focus:ring-[#1B5E20] border-gray-300 rounded mt-1" /><label htmlFor="terms" className="ml-2 block text-sm text-gray-900">J'accepte les <Link to="/cgu" className="underline">CGU</Link></label></div>
                        <div className="flex items-center"><input id="newsletter" name="newsletter" type="checkbox" className="h-4 w-4 text-[#1B5E20] focus:ring-[#1B5E20] border-gray-300 rounded" /><label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">Newsletter (optionnel)</label></div>
                      </div>
                      <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1B5E20] hover:bg-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B5E20] disabled:opacity-50">
                        {loading ? <><Loader2 className="animate-spin mr-2" /> Création en cours...</> : 'CRÉER MON COMPTE'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>;
};
export default RegisterPage;