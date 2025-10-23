# 🚀 IMPLÉMENTATION RAPIDE DES FONCTIONNALITÉS PRIORITAIRES

## ✅ Déjà fait

1. ✅ **Favoris** - Composant FavoriteButton créé et intégré
   - `src/components/FavoriteButton.jsx` créé
   - Intégré dans HomePage et AnnonceDetailPage

---

## 📝 À faire (Code prêt à copier)

### 2. ✏️ MODIFICATION D'ANNONCE (30 minutes)

#### Étape 1 : Créer EditAnnoncePage.jsx

Créer le fichier : `src/pages/EditAnnoncePage.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X as XIcon, Loader2, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { categoriesData } from '@/data/categories';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import CityAutocomplete from '@/components/CityAutocomplete';
import { FILE_LIMITS, VALIDATION, CURRENCIES } from '@/constants';

const EditAnnoncePage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [annonce, setAnnonce] = useState(null);
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newFilePreviewUrls, setNewFilePreviewUrls] = useState([]);
  const [location, setLocation] = useState(null);
  const [initialCityValue, setInitialCityValue] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    is_negotiable: false,
    is_free: false,
    phone: '',
    allow_whatsapp: false,
  });
  const [currency, setCurrency] = useState('CAD');

  useEffect(() => {
    const fetchAnnonce = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id) // Sécurité: seulement ses propres annonces
        .single();

      if (error || !data) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Annonce introuvable ou accès refusé.' });
        navigate('/profil/mes-annonces');
        return;
      }

      setAnnonce(data);
      
      // Pré-remplir les données
      const category = categoriesData.find(cat => cat.name === data.category);
      setSelectedCategory(category);
      setSelectedSubcategory(data.subcategory || '');
      setExistingImages(data.images_urls || []);
      
      setFormData({
        title: data.title,
        description: data.description,
        price: data.price || '',
        is_negotiable: data.is_negotiable,
        is_free: data.is_free,
        phone: data.phone || '',
        allow_whatsapp: data.allow_whatsapp || false,
      });
      
      if (data.city) {
        setInitialCityValue(`${data.city}${data.country ? ', ' + data.country : ''}`);
        setLocation({
          city: data.city,
          country: data.country,
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
      
      setLoading(false);
    };

    fetchAnnonce();
  }, [id, user, navigate, toast]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleNewFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalImages = existingImages.length + newFiles.length + selectedFiles.length;
    
    if (totalImages > FILE_LIMITS.MAX_IMAGES) {
      toast({ variant: 'destructive', title: 'Limite atteinte', description: `Maximum ${FILE_LIMITS.MAX_IMAGES} images au total.` });
      return;
    }
    
    const validFiles = selectedFiles.filter(file => file.size <= FILE_LIMITS.MAX_IMAGE_SIZE);
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    
    setNewFiles(prev => [...prev, ...validFiles]);
    setNewFilePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewFile = (index) => {
    if (newFilePreviewUrls[index]) {
      URL.revokeObjectURL(newFilePreviewUrls[index]);
    }
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewFilePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Titre et description obligatoires.' });
      return;
    }

    if (!selectedCategory || !selectedSubcategory) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Catégorie et sous-catégorie obligatoires.' });
      return;
    }

    setSaving(true);

    try {
      // Upload nouvelles images
      const newImageUrls = [];
      for (const file of newFiles) {
        const fileName = `${user.id}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage.from('annonce_images').upload(fileName, file);
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage.from('annonce_images').getPublicUrl(data.path);
        newImageUrls.push(publicUrl);
      }

      // Combiner anciennes et nouvelles images
      const allImages = [...existingImages, ...newImageUrls];

      // Update annonce
      const { error: updateError } = await supabase
        .from('annonces')
        .update({
          title: formData.title,
          description: formData.description,
          category: selectedCategory.name,
          subcategory: selectedSubcategory,
          price: formData.is_free ? 0 : parseFloat(formData.price) || null,
          is_negotiable: formData.is_negotiable,
          is_free: formData.is_free,
          images_urls: allImages,
          ...location
        })
        .eq('id', id);

      if (updateError) throw updateError;

      toast({ title: 'Succès', description: 'Annonce modifiée avec succès !' });
      navigate('/profil/mes-annonces');
    } catch (error) {
      console.error('Error updating annonce:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-green-700" /></div>;
  }

  return (
    <>
      <Helmet>
        <title>Modifier l'annonce - MBOA PLACE</title>
      </Helmet>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Link to="/profil/mes-annonces" className="text-[#1B5E20] hover:underline">← Retour à mes annonces</Link>
            <h1 className="text-3xl font-bold mt-4">Modifier l'annonce</h1>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Catégorie */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Catégorie</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categoriesData.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => { setSelectedCategory(cat); setSelectedSubcategory(''); }}
                    className={`p-4 rounded-lg border-2 text-center ${selectedCategory?.name === cat.name ? 'border-2' : 'border-gray-200'}`}
                    style={{borderColor: selectedCategory?.name === cat.name ? cat.color : undefined}}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <p className="font-bold text-sm mt-2">{cat.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sous-catégorie */}
            {selectedCategory && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sous-catégorie</label>
                <select
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  value={selectedSubcategory}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20]"
                >
                  <option value="">Sélectionnez</option>
                  {selectedCategory.subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
            )}

            {/* Titre et description */}
            <div className="space-y-4 mb-6">
              <input
                type="text"
                maxLength={80}
                placeholder="* Titre"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20]"
              />
              <textarea
                rows={5}
                placeholder="* Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20]"
              ></textarea>
            </div>

            {/* Prix */}
            <div className="mb-6">
              <div className="flex">
                <input
                  type="number"
                  placeholder="Prix"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  disabled={formData.is_free}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#1B5E20] disabled:bg-gray-100"
                />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="px-4 py-3 border-t border-r border-b border-gray-300 rounded-r-lg bg-gray-50">
                  {CURRENCIES.map(curr => <option key={curr.code} value={curr.code}>{curr.code}</option>)}
                </select>
              </div>
              <div className="mt-2 space-x-4">
                <label className="inline-flex items-center">
                  <input type="checkbox" name="is_negotiable" checked={formData.is_negotiable} onChange={handleInputChange} className="h-4 w-4 text-[#1B5E20] rounded" />
                  <span className="ml-2 text-sm">Négociable</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="checkbox" name="is_free" checked={formData.is_free} onChange={handleInputChange} className="h-4 w-4 text-[#1B5E20] rounded" />
                  <span className="ml-2 text-sm">Gratuit</span>
                </label>
              </div>
            </div>

            {/* Ville */}
            <div className="mb-6">
              <CityAutocomplete onSelect={setLocation} initialValue={initialCityValue} />
            </div>

            {/* Images */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3">Images</h3>
              
              {/* Images existantes */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Images actuelles</p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {existingImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`existing ${index}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <XIcon size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nouvelles images */}
              {newFilePreviewUrls.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Nouvelles images</p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {newFilePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`new ${index}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => removeNewFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <XIcon size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload */}
              {(existingImages.length + newFiles.length) < FILE_LIMITS.MAX_IMAGES && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#1B5E20] transition cursor-pointer relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleNewFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                  />
                  <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Ajouter des images</p>
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/profil/mes-annonces')}
                disabled={saving}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-3 rounded-lg font-bold transition disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? <><Loader2 className="animate-spin mr-2" size={20} /> Enregistrement...</> : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAnnoncePage;
```

#### Étape 2 : Ajouter la route dans App.jsx

Dans `src/App.jsx`, ajouter :

```jsx
import EditAnnoncePage from '@/pages/EditAnnoncePage'; // En haut avec les autres imports

// Dans les Routes :
<Route path="/annonce/edit/:id" element={<AuthGuard><EditAnnoncePage /></AuthGuard>} />
```

#### Étape 3 : Rendre le bouton "Modifier" fonctionnel dans MyAnnoncesPage

Dans `src/pages/MyAnnoncesPage.jsx`, ligne ~105 :

```jsx
// Remplacer
<button onClick={handleAction} className="..."><Edit size={16} /><span>Modifier</span></button>

// Par
<Link to={`/annonce/edit/${annonce.id}`} className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition text-sm">
  <Edit size={16} /><span>Modifier</span>
</Link>
```

---

### 3. 💬 CONTACTER LE VENDEUR (20 minutes)

Dans `src/pages/AnnonceDetailPage.jsx`, remplacer la fonction `handleAction` et les boutons :

```jsx
// Ajouter l'import
import { useAuth } from '@/contexts/SupabaseAuthContext';

// Dans le composant
const { user } = useAuth();

// Remplacer handleAction par cette fonction
const handleContactSeller = async () => {
  if (!user) {
    toast({ variant: 'destructive', title: 'Connexion requise', description: 'Veuillez vous connecter pour contacter le vendeur.' });
    navigate('/connexion');
    return;
  }

  if (user.id === annonce.user_id) {
    toast({ variant: 'destructive', title: 'Action impossible', description: 'Vous ne pouvez pas vous contacter vous-même.' });
    return;
  }

  try {
    // Vérifier si conversation existe déjà
    const { data: existingConv, error: checkError } = await supabase
      .from('conversations')
      .select('id')
      .eq('annonce_id', annonce.id)
      .or(`and(buyer_id.eq.${user.id},seller_id.eq.${annonce.user_id}),and(buyer_id.eq.${annonce.user_id},seller_id.eq.${user.id})`)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;

    let conversationId;

    if (existingConv) {
      conversationId = existingConv.id;
    } else {
      // Créer nouvelle conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          annonce_id: annonce.id,
          buyer_id: user.id,
          seller_id: annonce.user_id
        })
        .select()
        .single();

      if (createError) throw createError;
      conversationId = newConv.id;
    }

    // Rediriger vers messagerie
    navigate('/profil/messages', { state: { conversationId } });
  } catch (error) {
    console.error('Error creating conversation:', error);
    toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de créer la conversation.' });
  }
};

// Remplacer le bouton "CONTACTER LE VENDEUR" ligne ~165
<button onClick={handleContactSeller} className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white py-3 rounded-lg font-bold text-lg mb-4 transition flex items-center justify-center space-x-2">
  <Phone size={20} /><span>CONTACTER LE VENDEUR</span>
</button>

// Bouton Email
<button
  onClick={() => {
    if (annonce.profiles?.email) {
      window.location.href = `mailto:${annonce.profiles.email}?subject=Intéressé par: ${annonce.title}`;
    } else {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Email non disponible.' });
    }
  }}
  className="w-full flex items-center justify-center space-x-2 py-2 border rounded-lg hover:bg-gray-50 transition"
>
  <Mail size={20} /><span>Email</span>
</button>
```

---

Voulez-vous que je continue avec les 3 fonctionnalités restantes (Avis, Recherche avancée, Signalement) ou préférez-vous tester d'abord ces implémentations ?