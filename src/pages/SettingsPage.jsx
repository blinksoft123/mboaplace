
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ new_password: '', confirm_password: '' });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Les mots de passe ne correspondent pas.' });
      return;
    }
    if (passwords.new_password.length < 6) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Le mot de passe doit contenir au moins 6 caractères.' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passwords.new_password });
    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'La mise à jour du mot de passe a échoué.' });
    } else {
      toast({ title: 'Succès', description: 'Votre mot de passe a été mis à jour.' });
      setPasswords({ new_password: '', confirm_password: '' });
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Paramètres - MBOA PLACE</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Paramètres du compte</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6">Changer le mot de passe</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={user?.email || ''} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" />
            </div>
            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
              <input type="password" name="new_password" id="new_password" value={passwords.new_password} onChange={handlePasswordChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
            </div>
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
              <input type="password" name="confirm_password" id="confirm_password" value={passwords.confirm_password} onChange={handlePasswordChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
            </div>
            <div className="text-right">
              <button type="submit" disabled={loading} className="btn-secondary inline-flex items-center disabled:opacity-50">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
          <h2 className="text-2xl font-bold mb-4 text-red-800">Zone de danger</h2>
          <p className="text-red-700 mb-4">La suppression de votre compte est une action irréversible. Toutes vos données, annonces et messages seront définitivement perdus.</p>
          <button disabled className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
            Supprimer mon compte (Bientôt)
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
  