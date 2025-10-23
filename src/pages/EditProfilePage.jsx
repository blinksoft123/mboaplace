
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload } from 'lucide-react';

const EditProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({ full_name: '', city: '', phone: '', avatar_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error) {
        console.error("Error fetching profile", error);
      } else if (data) {
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile(prev => ({ ...prev, avatar_url: event.target.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    let avatar_url = profile.avatar_url;

    if (avatarFile) {
      const filePath = `${user.id}/${Date.now()}_${avatarFile.name}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, avatarFile, { upsert: true });
      if (uploadError) {
        toast({ variant: 'destructive', title: 'Erreur', description: "Échec du téléversement de l'avatar." });
        setSaving(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      avatar_url = publicUrl;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profile.full_name, city: profile.city, phone: profile.phone, avatar_url })
      .eq('id', user.id);

    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'La mise à jour du profil a échoué.' });
    } else {
      toast({ title: 'Succès', description: 'Votre profil a été mis à jour.' });
      // We might need to update the user metadata in the auth context as well
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-green-700" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>Modifier mon profil - MBOA PLACE</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Modifier mon profil</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div className="flex flex-col items-center space-y-4">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full object-cover" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-5xl font-bold">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <label htmlFor="avatar-upload" className="cursor-pointer flex items-center space-x-2 text-sm font-semibold text-[#1B5E20] hover:underline">
              <Upload size={16} />
              <span>Changer la photo</span>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Nom complet</label>
            <input type="text" name="full_name" id="full_name" value={profile.full_name || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
            <input type="text" name="city" id="city" value={profile.city || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input type="tel" name="phone" id="phone" value={profile.phone || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1B5E20] focus:border-[#1B5E20]" />
          </div>
          <div className="text-right">
            <button type="submit" disabled={saving} className="btn-secondary inline-flex items-center disabled:opacity-50">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfilePage;
  