# Guide de persistance des devises (Currency)

## 🎯 Problème résolu

Avant : Les prix s'affichaient toujours en CAD même si l'utilisateur choisissait une autre devise lors de la publication.

Maintenant : La devise choisie est sauvegardée et affichée correctement partout.

---

## 📝 Étapes d'installation

### 1. Migration de la base de données

Allez dans votre **Dashboard Supabase** :
1. Cliquez sur votre projet
2. Allez dans `SQL Editor` (menu de gauche)
3. Cliquez sur `New query`
4. Copiez-collez le contenu du fichier `DATABASE_MIGRATION_CURRENCY.sql`
5. Cliquez sur `Run` (ou `Ctrl + Enter`)

**Ou utilisez cette commande simple** :

```sql
ALTER TABLE annonces ADD COLUMN currency VARCHAR(3) DEFAULT 'CAD';
UPDATE annonces SET currency = 'CAD' WHERE currency IS NULL;
```

### 2. Vérifier que la migration a fonctionné

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'annonces' AND column_name = 'currency';
```

Vous devriez voir :
```
column_name | data_type
currency    | character varying
```

---

## ✅ Modifications du code (déjà faites)

### 1. PublishPage.jsx
- ✅ Sauvegarde le `currency` lors de la publication (ligne 124)

### 2. EditAnnoncePage.jsx
- ✅ Charge le `currency` lors de l'édition (ligne 77)
- ✅ Sauvegarde le `currency` lors de la mise à jour (ligne 173)

### 3. AnnonceDetailPage.jsx
- ✅ Affiche le currency correct (ligne 186)

### 4. AnnonceCard.jsx
- ✅ Affiche le currency correct sur toutes les cartes (ligne 64)

---

## 🧪 Test de la fonctionnalité

### Test 1 : Publication avec EUR
1. Allez sur `/publier`
2. Remplissez le formulaire
3. **Sélectionnez EUR** dans le sélecteur de devise
4. Publiez l'annonce
5. Vérifiez que le prix s'affiche en EUR partout :
   - Page de détail de l'annonce
   - Carte d'annonce sur la page d'accueil
   - Liste "Mes annonces"

### Test 2 : Publication avec XAF
1. Créez une nouvelle annonce
2. **Sélectionnez XAF**
3. Vérifiez l'affichage en XAF

### Test 3 : Édition
1. Éditez une annonce existante
2. Vérifiez que le currency affiché dans le formulaire est celui de l'annonce
3. Changez-le si nécessaire
4. Sauvegardez et vérifiez

---

## 🎨 Devises supportées

Le fichier `src/constants.js` contient les devises disponibles :

```javascript
export const CURRENCIES = [
  { code: 'CAD', name: 'Dollar canadien', symbol: '$' },
  { code: 'XAF', name: 'Franc CFA', symbol: 'FCFA' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'Dollar américain', symbol: '$' }
];
```

---

## 📊 Structure de la base de données

### Table `annonces` - Colonne ajoutée

| Colonne | Type | Défaut | Description |
|---------|------|--------|-------------|
| `currency` | VARCHAR(3) | 'CAD' | Code ISO 4217 de la devise (CAD, USD, EUR, XAF) |

---

## 🔄 Migration des données existantes

Toutes les annonces existantes auront automatiquement `CAD` comme devise par défaut après la migration.

Si vous souhaitez mettre à jour manuellement certaines annonces :

```sql
-- Mettre à jour une annonce spécifique
UPDATE annonces SET currency = 'EUR' WHERE id = 'votre-id';

-- Mettre à jour toutes les annonces d'une catégorie
UPDATE annonces SET currency = 'XAF' WHERE category = 'Voyages';
```

---

## 🐛 Dépannage

### Le currency ne s'affiche toujours pas
1. Vérifiez que la migration SQL a été exécutée avec succès
2. Vérifiez dans Supabase Table Editor que la colonne `currency` existe
3. Créez une nouvelle annonce de test
4. Vérifiez la console du navigateur (F12) pour des erreurs

### Les anciennes annonces affichent toujours CAD
C'est normal ! Elles ont été créées avant l'ajout du currency. Vous pouvez :
- Les laisser en CAD (par défaut)
- Les éditer pour changer la devise
- Les mettre à jour en masse avec SQL (voir ci-dessus)

### Erreur "column currency does not exist"
La migration SQL n'a pas été exécutée. Retournez à l'étape 1.

---

## 📈 Améliorations futures (optionnel)

1. **Conversion automatique des devises**
   - Intégrer une API de taux de change
   - Afficher les prix dans la devise préférée de l'utilisateur

2. **Symboles de devises**
   - Afficher € au lieu de EUR
   - Afficher $ au lieu de CAD/USD

3. **Validation des devises**
   - Ajouter un constraint CHECK en base de données
   ```sql
   ALTER TABLE annonces 
   ADD CONSTRAINT check_currency 
   CHECK (currency IN ('CAD', 'USD', 'EUR', 'XAF'));
   ```

---

## ✨ Résumé

La fonctionnalité de persistance des devises est maintenant complète :

✅ Sauvegarde lors de la publication  
✅ Sauvegarde lors de l'édition  
✅ Affichage correct partout  
✅ Migration SQL fournie  
✅ Documentation complète  

**Prochaine étape** : Exécuter le script SQL dans Supabase et tester ! 🚀
