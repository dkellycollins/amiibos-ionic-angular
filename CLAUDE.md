# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An Ionic Angular application for tracking Amiibo collections. Built with Angular 11, Ionic 5, and Firebase/Firestore for data persistence. Uses Capacitor for native mobile capabilities and NGXS for state management.

## Common Commands

### Development
- `npm start` - Start development server
- `ng serve` - Alternative to npm start
- `npm run build` - Build for production and sync with Capacitor
- `npm run build:prod` - Build with Ionic production optimizations

### Testing & Linting
- `npm test` - Run Karma/Jasmine unit tests
- `npm run lint` - Lint TypeScript files
- `npm run lint:fix` - Auto-fix linting issues
- `npm run e2e` - Run Protractor end-to-end tests

### Capacitor (Mobile)
- `cap sync` - Sync web assets to native platforms (automatically run after build)
- Android build output is in the `android/` directory

## Architecture

### State Management with NGXS

The application uses NGXS for centralized state management with two main feature states:

**AmiibosState** (`src/app/amiibos/state/amiibos.state.ts`)
- Manages all amiibos data and user collection status
- Uses `@ngxs-labs/firestore-plugin` for real-time Firestore synchronization
- Connects to Firestore when user is authenticated, falls back to localStorage when not
- Listens to `AuthActions.SetUser` to reload user's collection data when auth state changes
- State shape:
  ```typescript
  {
    allAmiibos: AmiiboModel[],      // All available amiibos from Firestore
    userAmiibos: UserAmiiboModel[],  // User's collection status
    filters: { type: string, series: string }
  }
  ```

**AuthState** (`src/app/auth/state/auth.state.ts`)
- Manages user authentication state
- Subscribes to Firebase auth changes on initialization
- State shape: `{ user?: UserModel }`

### Module Structure

The app follows Angular's feature module pattern:

- **AppModule** - Root module, imports NGXS with router and devtools plugins
- **AuthModule** - Authentication feature (AngularFire Auth, Google Sign-in via Capacitor)
- **AmiibosModule** - Core amiibo functionality (components, services, state)
- **CoreModule** - Shared UI components (ProgressBar, ProgressToolbar)
- **Pages** - Lazy-loaded routable pages under `src/app/pages/`

### Data Flow Pattern

1. **State Actions** - Components dispatch actions (e.g., `AmiibosActions.ToggleAmiibo`)
2. **State Handlers** - State classes handle actions, may call services
3. **Firestore Sync** - `NgxsFirestoreConnect` automatically syncs Firestore collections to state via `StreamEmitted` actions
4. **Services** - Business logic layer between components and Firestore/localStorage
5. **Components** - Subscribe to state via service observables or Store selectors

### Key Services

- **AmiibosService** - Facade for amiibos state, provides composed observables
- **AmiibosFirestore** / **UserAmiibosFirestore** - Firestore collection abstractions
- **UserAmiibosLocalStorage** - Local storage fallback when user is not authenticated
- **AuthService** - Firebase authentication wrapper using `capacitor-firebase-auth`
- **SubscriptionService** - Manages RxJS subscriptions lifecycle

### Firebase Configuration

Firebase config is in `src/environments/environment.ts` (and `environment.prod.ts`). The app connects to the `amiibos-firebase` project. Capacitor Firebase Auth is configured in `capacitor.config.json` for Google Sign-in.

### Routing

Main route is `/amiibos` with query params for filtering (`?series=...`). All other routes redirect to `/amiibos`. Uses `PreloadAllModules` strategy for lazy-loaded pages.

### PWA & Service Worker

Production builds enable Angular Service Worker (`ngsw-worker.js`) for offline functionality. Configuration in `src/ngsw-config.json`.

## Important Patterns

### NGXS Firestore Connection
When connecting Firestore to NGXS state, use `ngxsFirestoreConnect.connect()` in `ngxsOnInit()`. The connection automatically handles streaming updates and emits `StreamEmitted` actions that are handled separately.

### Authenticated vs Unauthenticated Data
User collection data is stored in Firestore when authenticated, localStorage when not. The `AmiibosState.ToggleAmiibo` action checks auth state and routes to the appropriate service.

### Module Registration
Feature states must be registered with `NgxsModule.forFeature([StateClass])` in their feature module, not the root module.
