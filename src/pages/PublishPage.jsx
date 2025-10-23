
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Upload, Check, X as XIcon, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { categoriesData } from '@/data/categories';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import CityAutocomplete from '@/components/CityAutocomplete';
import { FILE_LIMITS, VALIDATION, CURRENCIES } from '@/constants';
import logger from '@/utils/logger';

const PublishPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [files, setFiles] = useState([]);
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
  const [filePreviewUrls, setFilePreviewUrls] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('city, country, latitude, longitude')
          .eq('id', user.id)
          .single();
        
        if (error) {
          logger.error("Error fetching profile:", error);
        } else if (data) {
          setProfile(data);
          if (data.city && data.country) {
            setInitialCityValue(`${data.city}, ${data.country}`);
            setLocation({
              city: data.city,
              country: data.country,
              latitude: data.latitude,
              longitude: data.longitude,
            });
          }
        }
      }
    };
    fetchProfile();
  }, [user]);

  // Cleanup file preview URLs to prevent memory leak
  useEffect(() => {
    return () => {
      filePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [filePreviewUrls]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory('');
  };

  const handlePublish = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: "Erreur", description: "Vous devez être connecté pour publier une annonce." });
        return;
    }
    if (!location) {
        toast({ variant: 'destructive', title: "Erreur", description: "Veuillez sélectionner une ville." });
        return;
    }

    setLoading(true);

    try {
      // Upload des images en parallèle pour améliorer les performances
      const uploadPromises = files.map((file, index) => {
        const fileName = `${user.id}/${Date.now()}_${index}_${file.name}`;
        return supabase.storage
          .from('annonce_images')
          .upload(fileName, file)
          .then(({ data, error }) => {
            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage
              .from('annonce_images')
              .getPublicUrl(data.path);
            return publicUrl;
          });
      });
      
      const images_urls = await Promise.all(uploadPromises);

      const annonceData = {
          seller_id: user.id,
          title: formData.title,
          description: formData.description,
          category: selectedCategory.name,
          subcategory: selectedSubcategory,
          price: formData.is_free ? 0 : parseFloat(formData.price) || null,
          currency: currency, // Sauvegarder la devise
          is_negotiable: formData.is_negotiable,
          is_free: formData.is_free,
          images_urls,
          status: 'active',
          ...location
      };

      const { data: newAnnonce, error: annonceError } = await supabase
          .from('annonces')
          .insert(annonceData)
          .select()
          .single();

      if (annonceError) throw annonceError;

      toast({
        title: "✅ Votre annonce est en ligne !",
        description: "Félicitations, votre annonce a été publiée avec succès.",
      });
      setStep(5);
    } catch (error) {
        logger.error("Error publishing ad:", error);
        toast({ variant: 'destructive', title: "Erreur de publication", description: error.message });
    } finally {
        setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Filter files by size
    const validFiles = [];
    const invalidFiles = [];
    
    selectedFiles.forEach(file => {
      if (file.size <= FILE_LIMITS.MAX_IMAGE_SIZE) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });
    
    // Show error for files that are too large
    if (invalidFiles.length > 0) {
      toast({ 
        variant: 'destructive', 
        title: 'Fichiers trop volumineux', 
        description: `${invalidFiles.length} fichier(s) dépassent ${FILE_LIMITS.MAX_IMAGE_SIZE_MB}MB et ont été ignorés.` 
      });
    }
    
    // Take only up to max allowed
    const filesToAdd = validFiles.slice(0, FILE_LIMITS.MAX_IMAGES - files.length);
    
    // Create preview URLs for new files
    const newPreviewUrls = filesToAdd.map(file => URL.createObjectURL(file));
    
    setFiles(prev => [...prev, ...filesToAdd]);
    setFilePreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeFile = (index) => {
    // Revoke the object URL to prevent memory leak
    if (filePreviewUrls[index]) {
      URL.revokeObjectURL(filePreviewUrls[index]);
    }
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep2 = () => {
    // Title validation
    if (!formData.title.trim()) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Le titre est obligatoire.' });
      return false;
    }
    if (formData.title.trim().length < VALIDATION.TITLE_MIN_LENGTH) {
      toast({ variant: 'destructive', title: 'Erreur', description: `Le titre doit contenir au moins ${VALIDATION.TITLE_MIN_LENGTH} caractères.` });
      return false;
    }
    
    // Description validation
    if (!formData.description.trim()) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'La description est obligatoire.' });
      return false;
    }
    if (formData.description.trim().length < VALIDATION.DESCRIPTION_MIN_LENGTH) {
      toast({ variant: 'destructive', title: 'Erreur', description: `La description doit contenir au moins ${VALIDATION.DESCRIPTION_MIN_LENGTH} caractères.` });
      return false;
    }
    
    // Price validation (if not free)
    if (!formData.is_free) {
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez entrer un prix valide ou cocher "Gratuit".' });
        return false;
      }
    }
    
    // Location validation
    if (!location) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez sélectionner une ville.' });
      return false;
    }
    
    return true;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">Que souhaitez-vous publier ?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {categoriesData.map((cat) => (
                <button key={cat.name} onClick={() => handleCategorySelect(cat)} className={`p-6 rounded-lg border-2 transition text-center ${selectedCategory?.name === cat.name ? 'border-2' : 'border-gray-200 hover:border-gray-400'}`} style={{borderColor: selectedCategory?.name === cat.name ? cat.color : undefined}}>
                  <span className="text-3xl">{cat.icon}</span>
                  <h3 className="font-bold mt-2">{cat.name}</h3>
                </button>
              ))}
            </div>
            {selectedCategory && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sous-catégorie</label>
                <select onChange={(e) => setSelectedSubcategory(e.target.value)} value={selectedSubcategory} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent">
                  <option value="">Sélectionnez une sous-catégorie</option>
                  {selectedCategory.subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </motion.div>
            )}
            <button onClick={() => setStep(2)} disabled={!selectedCategory || !selectedSubcategory} className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-3 rounded-lg font-bold text-lg transition disabled:opacity-50">Suivant →</button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">Détails de l'annonce</h2>
            <div className="space-y-6">
              <input type="text" maxLength={80} placeholder="* Titre de l'annonce (max 80 car.)" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20]" />
              <textarea rows={5} placeholder="* Description (min 50 car.)" name="description" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20]"></textarea>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex"><input type="number" placeholder="Prix/Montant" name="price" value={formData.price} onChange={handleInputChange} disabled={formData.is_free} className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#1B5E20] disabled:bg-gray-100" /><select value={currency} onChange={(e) => setCurrency(e.target.value)} className="px-4 py-3 border-t border-r border-b border-gray-300 rounded-r-lg bg-gray-50">{CURRENCIES.map(curr => <option key={curr.code} value={curr.code}>{curr.code}</option>)}</select></div>
                  <div className="mt-2 space-x-4"><label className="inline-flex items-center"><input type="checkbox" name="is_negotiable" checked={formData.is_negotiable} onChange={handleInputChange} className="h-4 w-4 text-[#1B5E20] rounded" /> <span className="ml-2 text-sm">Négociable</span></label><label className="inline-flex items-center"><input type="checkbox" name="is_free" checked={formData.is_free} onChange={handleInputChange} className="h-4 w-4 text-[#1B5E20] rounded" /> <span className="ml-2 text-sm">Gratuit</span></label></div>
                </div>
                <CityAutocomplete onSelect={setLocation} initialValue={initialCityValue} />
              </div>
              <div>
                <input type="tel" placeholder="Téléphone (+1)" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20]" />
                <label className="flex items-center mt-2"><input type="checkbox" name="allow_whatsapp" checked={formData.allow_whatsapp} onChange={handleInputChange} className="h-4 w-4 text-[#1B5E20] rounded" /> <span className="ml-2 text-sm">Autoriser WhatsApp</span></label>
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <button onClick={() => setStep(1)} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-lg hover:bg-gray-50 transition">← Retour</button>
              <button onClick={() => { if (validateStep2()) setStep(3); }} className="flex-1 bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-3 rounded-lg font-bold text-lg transition">Suivant →</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">Photos (optionnel)</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6 hover:border-[#1B5E20] transition cursor-pointer relative">
              <input type="file" multiple onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" disabled={files.length >= FILE_LIMITS.MAX_IMAGES} />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold mb-2">📷 Glissez vos photos ici ou cliquez</p>
              <p className="text-sm text-gray-500">Maximum {FILE_LIMITS.MAX_IMAGES} photos, {FILE_LIMITS.MAX_IMAGE_SIZE_MB}MB chacune</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
              {filePreviewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={`preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
                  <button onClick={() => removeFile(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><XIcon size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex space-x-4 mt-8">
              <button onClick={() => setStep(2)} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-lg hover:bg-gray-50 transition">← Retour</button>
              <button onClick={() => setStep(4)} className="flex-1 bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-3 rounded-lg font-bold text-lg transition">Suivant →</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-3xl font-bold mb-6">Publication</h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Aperçu de votre annonce</h3>
              <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm mx-auto">
                <div className="h-48 bg-gray-300 flex items-center justify-center text-gray-500">
                  {filePreviewUrls.length > 0 ? <img src={filePreviewUrls[0]} alt="preview" className="w-full h-full object-cover" /> : 'Image'}
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2 truncate">{formData.title || 'Titre de votre annonce'}</h4>
                  <p className="text-[#FF6F00] font-bold text-xl mb-2">{formData.is_free ? 'Gratuit' : `${formData.price || 'Prix'} ${currency}`}</p>
                  <p className="text-sm text-gray-600">📍 {location?.city || 'Ville'} • Il y a quelques instants</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 mb-6">
              <label className="flex items-start space-x-3"><input type="checkbox" className="w-5 h-5 text-[#1B5E20] rounded mt-1" required/><span>J'accepte les <a href="/cgu" className="text-[#1B5E20] hover:underline">CGU</a></span></label>
              <label className="flex items-start space-x-3"><input type="checkbox" className="w-5 h-5 text-[#1B5E20] rounded mt-1" /><span>Recevoir des notifications par email</span></label>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setStep(3)} disabled={loading} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-lg hover:bg-gray-50 transition">← Retour</button>
              <button onClick={handlePublish} disabled={loading} className="flex-1 bg-[#FF6F00] hover:bg-[#E65100] text-white py-3 rounded-lg font-bold text-lg transition flex items-center justify-center space-x-2 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <span>🚀 PUBLIER MON ANNONCE</span>}
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center py-12">
            <CheckCircle size={80} className="mx-auto mb-6 text-green-500" />
            <h2 className="text-3xl font-bold mb-4">✅ Votre annonce est en ligne !</h2>
            <p className="text-gray-600 mb-8">Elle est maintenant visible par toute la communauté MBOA PLACE.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/profil/mes-annonces" className="bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-6 py-3 rounded-lg font-bold transition">Voir mes annonces</Link>
              <button onClick={() => { setStep(1); setSelectedCategory(null); setFiles([]); }} className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition">Publier une autre annonce</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const progressSteps = ["Catégorie", "Détails", "Photos", "Publication"];

  return (
    <>
      <Helmet>
        <title>Publier une annonce - MBOA PLACE</title>
        <meta name="description" content="Publiez votre annonce gratuitement sur MBOA PLACE" />
      </Helmet>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {step < 5 && (
            <div className="mb-8">
              <div className="flex items-center mb-2">
                {progressSteps.map((name, index) => (
                  <React.Fragment key={name}>
                    <div className={`flex items-center ${step > index + 1 ? 'text-[#1B5E20]' : step === index + 1 ? 'text-[#1B5E20]' : 'text-gray-500'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${step > index + 1 ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : step === index + 1 ? 'border-[#1B5E20]' : 'border-gray-300'}`}>
                        {step > index + 1 ? <Check size={20} /> : index + 1}
                      </div>
                      <span className="ml-2 hidden sm:block">{name}</span>
                    </div>
                    {index < progressSteps.length - 1 && <div className={`flex-1 h-1 mx-2 ${step > index + 1 ? 'bg-[#1B5E20]' : 'bg-gray-300'}`}></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg shadow-lg p-8">
            {renderStep()}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PublishPage;
