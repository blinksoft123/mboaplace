# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development
```bash
# Start development server on http://localhost:3000
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment
After building, the `dist/` folder contains all optimized static files ready for deployment. The application has been deployed to production at **mboaplace.com**.

## Architecture

### Technology Stack
- **Framework**: React 18 with React Router v6
- **Build Tool**: Vite 4
- **Styling**: Tailwind CSS with custom theme + Shadcn UI components
- **Backend**: Supabase (PostgreSQL database, authentication, storage, realtime)
- **State Management**: React Context API (SupabaseAuthContext)
- **Animations**: Framer Motion

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Header, Footer
│   ├── ui/             # Shadcn UI primitives
│   └── *.jsx           # Feature components (FavoriteButton, AnnonceCard, etc.)
├── contexts/           # React Context providers
│   └── SupabaseAuthContext.jsx  # Authentication state & user profile
├── pages/              # 30+ page components (one per route)
├── hooks/              # Custom React hooks
│   ├── useCachedSupabaseQuery.js  # Query hook with cache
│   └── useSupabaseQuery.js        # Base query hook
├── utils/              # Utility functions
│   ├── cache.js        # In-memory cache manager with TTL
│   ├── logger.js       # Console logging utility
│   └── constants.js    # Error messages and constants
├── data/               # Static data
│   └── categories.js   # Categories and subcategories
└── lib/                # Third-party integrations
    └── customSupabaseClient.js  # Supabase client singleton
```

### Authentication Flow

Authentication uses Supabase Auth with the following providers:
- **Email/Password**: Standard email authentication
- **Google OAuth**: Configured with redirect URL cleanup
- **Facebook OAuth**: UI present but not yet configured

**Critical OAuth Implementation Detail**: After Google OAuth callback, the hash (`#access_token=...`) is automatically cleaned from the URL using `window.history.replaceState()` in `SupabaseAuthContext.jsx`. This ensures clean URLs after authentication.

The `SupabaseAuthContext` provides:
- `user`: Current authenticated user (Supabase Auth user object)
- `profile`: User profile data from `profiles` table
- `loading`: Auth loading state
- `signOut()`: Logout function

### Route Protection

Three route guards are defined in `App.jsx`:
- **AuthGuard**: Requires authenticated user (redirects to `/connexion`)
- **AdminGuard**: Requires admin role (redirects to `/profil`)
- **PublicOnlyGuard**: Only for logged-out users (redirects to `/profil` if logged in)

### Database Schema

Tables:
- `profiles`: User profiles (linked to auth.users via trigger)
- `annonces`: Classified ads/listings
- `conversations`: Message threads
- `messages`: Individual messages (with Realtime subscriptions)
- `reviews`: User reviews (partially implemented)
- `favorites`: Saved listings
- `reports`: User reports/moderation

Storage buckets:
- `avatars`: Profile pictures
- `annonce_images`: Listing images (max 10 per listing)

### Data Fetching Pattern

Use the custom hooks instead of raw Supabase queries:

```javascript
// With caching (preferred for frequently accessed data)
import { useCachedSupabaseQuery } from '@/hooks/useCachedSupabaseQuery';

const { data, error, loading, execute, invalidateCache } = useCachedSupabaseQuery(
  async () => supabase.from('annonces').select('*').limit(8),
  {
    cacheKey: 'recent-annonces',
    cacheTTL: 5 * 60 * 1000, // 5 minutes
    errorMessage: 'Failed to load listings'
  }
);
```

The cache manager (`src/utils/cache.js`) provides:
- TTL-based expiration (default 5 minutes)
- Prefix-based invalidation
- Automatic cleanup every 10 minutes

### Key Components

**AnnonceCard**: Displays listing preview with image, title, price, location
**FavoriteButton**: Toggle favorite status (integrated with Supabase `favorites` table)
**CityAutocomplete**: Google Places API autocomplete for location selection
**ErrorBoundary**: Top-level error boundary wrapping the entire app
**OptimizedImage**: Lazy-loaded images with loading states

### Path Aliases

Use `@/` to reference `src/`:
```javascript
import { supabase } from '@/lib/customSupabaseClient';
import Header from '@/components/layout/Header';
```

### Color Palette

Primary brand color: `#1B5E20` (dark green) used throughout the app for buttons, links, and accents.

Category colors defined in `src/data/categories.js`:
- Échanges & Transferts: `#22C55E` (green)
- Colis & Voyages: `#3B82F6` (blue)
- Commerce: `#F97316` (orange)
- Immobilier: `#EF4444` (red)
- Emploi & Services: `#EAB308` (yellow)

## Environment Configuration

Required environment variables in `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Never commit** `.env.local` or any file containing these values.

## Known Issues & Incomplete Features

### High Priority (Core functionality missing)
1. **Edit Listing**: EditAnnoncePage exists but not fully wired up
2. **Initiate Conversation**: "Contact Seller" button not functional - needs to create conversation + redirect to messages
3. **Favorites on Cards**: FavoriteButton component exists but not integrated on HomePage and CategoryDetailPage cards
4. **Advanced Search**: Only basic search by title implemented - missing filters by price, location, category
5. **Reviews System**: Database tables exist but no UI to leave/display reviews
6. **Report Functionality**: Report button displayed but not functional

### Medium Priority
7. **Admin Dashboard**: AdminDashboardPage created but mostly empty
8. **Notifications**: No notification system implemented
9. **Email System**: No automated emails configured
10. **Premium Features**: PremiumPage is informational only, no payment integration

Full audit in `FEATURES_AUDIT_AND_ROADMAP.md`.

## Firebase Integration (From User Rules)

When integrating Firebase for mobile or additional features, use:
- **Android**: Google services Gradle plugin
- **Web**: Firebase Web SDK with configuration in `firebase.config.js` or similar

## Important Notes

### OAuth Hash Cleanup
The OAuth callback includes access tokens in URL hash. The code in `SupabaseAuthContext.jsx` handles cleanup automatically. If modifying auth flow, preserve this behavior to maintain clean URLs post-login.

### Realtime Subscriptions
MessagesPage uses Supabase Realtime for live message updates. When adding similar features, remember to:
- Subscribe in useEffect
- Clean up subscriptions in return function
- Handle reconnection logic

### Image Uploads
Max 10 images per listing enforced in PublishPage. Images are stored in Supabase Storage with public URLs. Use OptimizedImage component for display to handle loading states and errors.

### Cache Invalidation
When mutating data (create, update, delete), invalidate relevant cache keys:
```javascript
cacheManager.invalidateByPrefix('annonces');
```

### Deployment Cache
After deploying to production (mboaplace.com), may need to:
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Purge CDN cache if using Cloudflare or similar
- Check for service worker if implemented

See `DEPLOIEMENT_URGENT.md` for full deployment checklist.

## Testing Strategy

No test framework configured yet. Before adding tests:
- Check for existing test commands in package.json
- Verify if Jest, Vitest, or other framework is intended
- Review project documentation for testing approach

## Visual Editor Plugins

Development mode includes custom Vite plugins for visual editing:
- `inlineEditPlugin()`: Inline code editing
- `editModeDevPlugin()`: Edit mode development tools
- `iframeRouteRestorationPlugin()`: Route restoration in iframe context

These are loaded from `plugins/visual-editor/` and only active in dev mode.
