/**
 * EXEMPLES D'UTILISATION du hook useSupabaseQuery
 * 
 * Ce fichier contient des exemples d'utilisation du hook personnalisé
 * pour gérer les requêtes Supabase avec gestion d'erreurs centralisée.
 */

import { useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { ANNONCE_STATUS } from '@/utils/constants';

// ============================================
// EXEMPLE 1 : Récupération simple de données
// ============================================
function ExampleSimpleFetch() {
  const { data, error, loading, execute } = useSupabaseQuery(
    async () => {
      return await supabase
        .from('annonces')
        .select('*')
        .eq('status', ANNONCE_STATUS.ACTIVE);
    }
  );

  useEffect(() => {
    execute();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;
  
  return <div>Annonces : {data?.length}</div>;
}

// ============================================
// EXEMPLE 2 : Avec callbacks onSuccess/onError
// ============================================
function ExampleWithCallbacks() {
  const { data, loading, execute } = useSupabaseQuery(
    async (id) => {
      return await supabase
        .from('annonces')
        .select('*')
        .eq('id', id)
        .single();
    },
    {
      onSuccess: (data) => {
        console.log('Annonce récupérée avec succès:', data);
        // Faire quelque chose avec les données
      },
      onError: (error) => {
        alert(`Erreur: ${error.message}`);
      },
      errorMessage: 'Impossible de charger l\'annonce'
    }
  );

  const handleFetchAnnonce = (id) => {
    execute(id);
  };

  return (
    <button onClick={() => handleFetchAnnonce('123')}>
      Charger l'annonce
    </button>
  );
}

// ============================================
// EXEMPLE 3 : Mutation (INSERT/UPDATE/DELETE)
// ============================================
function ExampleMutation() {
  const { loading, error, execute, reset } = useSupabaseQuery(
    async (annonceData) => {
      return await supabase
        .from('annonces')
        .insert([annonceData]);
    },
    {
      onSuccess: () => {
        alert('Annonce créée avec succès !');
        reset(); // Réinitialiser l'état
      },
      errorMessage: 'Impossible de créer l\'annonce'
    }
  );

  const handleSubmit = async (formData) => {
    const { data, error } = await execute(formData);
    
    if (!error) {
      // Rediriger ou faire autre chose
      console.log('Annonce créée:', data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulaire */}
      {error && <div className="error">{error.message}</div>}
      <button disabled={loading}>
        {loading ? 'Création...' : 'Créer l\'annonce'}
      </button>
    </form>
  );
}

// ============================================
// EXEMPLE 4 : Requête avec paramètres multiples
// ============================================
function ExampleMultipleParams() {
  const { data, loading, execute } = useSupabaseQuery(
    async (category, city, limit = 20) => {
      let query = supabase
        .from('annonces')
        .select('*')
        .eq('status', ANNONCE_STATUS.ACTIVE);

      if (category) query = query.eq('category', category);
      if (city) query = query.eq('city', city);
      
      return await query.limit(limit);
    }
  );

  const handleSearch = () => {
    execute('emploi', 'Montreal', 10);
  };

  return <button onClick={handleSearch}>Rechercher</button>;
}

// ============================================
// EXEMPLE 5 : Requête avec réinitialisation
// ============================================
function ExampleWithReset() {
  const { data, loading, error, execute, reset } = useSupabaseQuery(
    async (searchTerm) => {
      return await supabase
        .from('annonces')
        .select('*')
        .ilike('title', `%${searchTerm}%`);
    }
  );

  const handleClear = () => {
    reset(); // Réinitialise data, error, loading
  };

  return (
    <div>
      <input onChange={(e) => execute(e.target.value)} />
      <button onClick={handleClear}>Effacer</button>
      {loading && <div>Recherche...</div>}
      {error && <div>Erreur: {error.message}</div>}
      {data && <div>{data.length} résultats</div>}
    </div>
  );
}

export {
  ExampleSimpleFetch,
  ExampleWithCallbacks,
  ExampleMutation,
  ExampleMultipleParams,
  ExampleWithReset
};
