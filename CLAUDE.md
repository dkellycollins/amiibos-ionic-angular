# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An Ionic Angular Progressive Web Application (PWA) for tracking Amiibo collections. Built with Angular 18, Ionic 8, and Firebase/Firestore for data persistence. Uses Angular Signals for reactive state management.

**Technology Stack:**
- Angular 18 with standalone components
- Ionic Framework 8
- Firebase 10 (modular SDK)
- Angular Signals for state management
- TypeScript 5.4
- ESLint for linting
- Cypress for E2E testing

## Common Commands

### Development
- `npm start` - Start development server
- `ng serve` - Alternative to npm start
- `npm run build` - Build for production
- `npm run build:prod` - Build with production optimizations

### Testing & Linting
- `npm test` - Run Karma/Jasmine unit tests
- `npm run lint` - Lint TypeScript files with ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run e2e` - Run Cypress E2E tests (interactive mode)
- `npm run e2e:headless` - Run Cypress E2E tests (headless mode)

## Architecture

### Standalone Components Architecture

The application uses Angular's standalone components pattern:

- **No NgModules** - All components are standalone with explicit imports
- **Functional Routing** - Routes use `loadComponent` for lazy loading
- **Bootstrap** - Application bootstrapped via `bootstrapApplication` in `main.ts`
- **Provider Configuration** - All services configured in bootstrap providers

### State Management with Angular Signals

The application uses Angular Signals for reactive state management, replacing the previous NGXS implementation:

**AuthStore** (`src/app/auth/services/auth.store.ts`)
- Manages user authentication state using Signals
- Converts Firebase auth observable to Signal with `toSignal()`
- Provides computed `isAuthenticated` signal
- State shape:
  ```typescript
  {
    user: Signal<UserModel | undefined>,
    isAuthenticated: Signal<boolean>
  }
  ```

**AmiibosStore** (`src/app/amiibos/services/amiibos.store.ts`)
- Manages all amiibos data and user collection status
- Uses Signals for reactive state updates
- Automatically syncs with Firestore in real-time
- Provides computed values for filtered lists and progress
- State shape:
  ```typescript
  {
    allAmiibos: Signal<AmiiboModel[]>,
    userAmiibos: Signal<UserAmiiboModel[]>,
    filters: Signal<{ type: string | null, series: string | null }>,
    selectedAmiibos: Signal<AmiiboModel[]>,           // computed
    collectedAmiibos: Signal<CollectableAmiiboModel[]>, // computed
    progress: Signal<{ total: number, collected: number }> // computed
  }
  ```

### Data Flow Pattern

1. **User Interaction** - Components call store methods (e.g., `amiibosStore.toggleAmiibo()`)
2. **Store Updates** - Store methods update signals and call Firestore services
3. **Reactive Updates** - Computed signals automatically recalculate
4. **Service Layer** - AmiibosService provides Observable wrappers via `toObservable()` for backward compatibility
5. **Components** - Subscribe to observables or use signals directly in templates
6. **Firestore Sync** - Real-time listeners update signals automatically

### Key Services

- **AuthStore** - Signal-based authentication state management
- **AmiibosStore** - Signal-based collection state management
- **AmiibosService** - Facade that converts store signals to observables for components
- **AmiibosFirestore** - Firestore collection abstraction (Firebase modular SDK)
- **UserAmiibosFirestore** - User collection Firestore abstraction
- **UserAmiibosLocalStorage** - Local storage fallback when user is not authenticated
- **AuthService** - Firebase authentication wrapper (Google Sign-in with redirect)

### Firebase Configuration

Firebase config is in `src/environments/environment.ts` (and `environment.prod.ts`). The app connects to the `amiibos-firebase` project using the Firebase 10 modular SDK:

- `provideFirebaseApp()` - Initialize Firebase app
- `provideAuth()` - Firebase Authentication
- `provideFirestore()` - Cloud Firestore

Authentication uses `signInWithRedirect` for Google Sign-in (web-only, no native mobile).

### Routing

Routes are defined in `src/app/app.routes.ts`:
- `/amiibos/figures` - Amiibo figures collection
- `/amiibos/cards` - Amiibo cards collection
- Uses `loadComponent` for lazy loading
- `PreloadAllModules` strategy for optimal performance
- Route data contains `type` filter for collection type

### PWA & Service Worker

Production builds enable Angular Service Worker (`ngsw-worker.js`) for offline functionality:
- Configuration in `src/ngsw-config.json`
- Configured via `provideServiceWorker()` in `main.ts`
- Installable as a PWA on mobile and desktop
- Works offline with cached data

## Important Patterns

### Signal-Based State Management

**Creating Signals:**
```typescript
private readonly dataSignal = signal<DataType[]>([]);
public readonly data = this.dataSignal.asReadonly();
```

**Computed Values:**
```typescript
public readonly filteredData = computed(() => {
  return this.data().filter(item => /* filter logic */);
});
```

**Converting Signals to Observables:**
```typescript
public readonly data$ = toObservable(this.store.data);
```

**Converting Observables to Signals:**
```typescript
private readonly userSignal = toSignal(this.authService.getUser(), {
  initialValue: undefined
});
```

### Firebase Modular SDK Patterns

**Reading Collections:**
```typescript
const ref = collection(this.firestore, 'collection-name');
return collectionData(ref, { idField: 'id' }) as Observable<Model[]>;
```

**Writing Documents:**
```typescript
const docRef = doc(this.firestore, 'collection-name', docId);
await setDoc(docRef, data, { merge: true });
```

**Querying with Filters:**
```typescript
const q = query(
  collection(this.firestore, 'collection-name'),
  where('field', '==', value)
);
return collectionData(q, { idField: 'id' });
```

### Authenticated vs Unauthenticated Data

User collection data is stored in Firestore when authenticated, localStorage when not. The `AmiibosStore` automatically:
- Subscribes to auth state changes
- Loads user collection from Firestore when authenticated
- Falls back to localStorage for guest users
- Syncs changes to appropriate storage backend

### Standalone Component Patterns

**Component Declaration:**
```typescript
@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  standalone: true,
  imports: [CommonModule, IonicModule, OtherComponents]
})
export class MyComponent { }
```

**New Control Flow Syntax:**
```html
<!-- Conditionals -->
@if (condition) {
  <div>Content</div>
} @else {
  <div>Alternative</div>
}

<!-- Loops -->
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}
```

### Dependency Injection

All services use `providedIn: 'root'` for tree-shakeable providers:
```typescript
@Injectable({ providedIn: 'root' })
export class MyService { }
```

For services that need to be scoped to a component:
```typescript
@Component({
  providers: [ScopedService]
})
```

## Build Configuration

The application uses the ESBuild application builder for faster builds:
- Configured in `angular.json` with builder `@angular-devkit/build-angular:application`
- Output directory: `www/`
- Production optimizations include tree-shaking, minification, and source maps
