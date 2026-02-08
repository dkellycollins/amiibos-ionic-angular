# Key Features - Amiibos Ionic Angular

## Overview
A Progressive Web App (PWA) for tracking and managing personal Amiibo figure and card collections. Built with Angular 18, Ionic 8, and Firebase.

## Core Features

### 1. Collection Management
- **Track Amiibo Figures** - Browse and track Nintendo Amiibo figure collections
- **Track Amiibo Cards** - Separate collection for Amiibo cards (e.g., Animal Crossing cards)
- **Toggle Collection Status** - Mark individual amiibos as collected/uncollected with a simple toggle switch
- **Collection Progress** - Real-time progress bar showing collected vs total amiibos (displayed in footer)

### 2. Filtering & Organization
- **Filter by Series** - Filter amiibos by their series (e.g., Super Mario, Legend of Zelda, Animal Crossing)
- **Series Selection Modal** - Interactive modal to select from available series within the current collection type
- **Type-Based Navigation** - Separate views for Figures and Cards collections
- **Dynamic Filtering** - Series filters update based on the selected collection type

### 3. Authentication & Data Sync
- **Google Sign-In** - OAuth authentication via Google (using Firebase Auth with redirect)
- **Guest Mode** - Use the app without signing in (data stored locally)
- **Cloud Sync for Authenticated Users** - Collection data automatically synced to Firebase Firestore when logged in
- **Local Storage Fallback** - Guest users have their collection saved in browser localStorage
- **Automatic Data Migration** - When a guest user logs in, their collection can be transferred to the cloud

### 4. User Interface
- **Side Menu Navigation** - Hamburger menu with:
  - User profile display (photo, name, or "Guest")
  - Login/Logout actions
  - Quick navigation to Figures or Cards collections
  - App version display
- **Amiibo Item Display** - Each amiibo shows:
  - Thumbnail image with alt text for accessibility
  - Name and series
  - Description (expandable)
  - Collection toggle switch
- **Responsive Design** - Built with Ionic components for mobile-first experience
- **Progress Toolbar** - Persistent footer showing collection completion stats
- **Modern Control Flow** - Angular 18's @if/@for syntax for better performance

### 5. Progressive Web App (PWA)
- **Offline Support** - Angular Service Worker enables offline functionality in production
- **Install to Home Screen** - Can be installed as a standalone app on mobile and desktop devices
- **App Manifest** - Configured for native-like installation experience
- **Cross-Browser Support** - Works on Chrome, Firefox, Safari, and Edge
- **Mobile Optimized** - Touch-friendly interface works great on phones and tablets

## Data Architecture

### Real-Time Sync
- Firestore collections stream updates in real-time to the app
- Changes to collection status immediately sync across devices for authenticated users
- Angular Signals provide reactive data flow throughout the application
- Computed signals automatically recalculate when dependencies change

### Data Models
- **Amiibo Data** - Includes slug, name, description, series, type, figure URL, release date
- **User Collection Data** - Links user UID to amiibo slug with collection status
- **Collection Progress** - Calculated dynamically from selected filters and user collection

## Technical Highlights

### Modern Angular Architecture
- **Angular 18** - Latest Angular features including Signals and standalone components
- **Standalone Components** - No NgModules, fully modular with explicit imports
- **Signal-Based State** - Reactive state management using Angular Signals
- **Computed Values** - Automatic derivation of filtered lists and progress metrics
- **New Control Flow** - @if/@for syntax for better type safety and performance

### State Management
- **AuthStore** - Signal-based authentication state management
- **AmiibosStore** - Signal-based collection state with computed filters and progress
- **Observable Compatibility** - Services provide Observable wrappers via `toObservable()` for templates
- **Reactive Updates** - Signals automatically propagate changes through the component tree

### Firebase Integration
- **Firebase 10 Modular SDK** - Tree-shakeable, modern Firebase API
- **Real-time Database** - Firestore real-time listeners for instant sync
- **Firebase Authentication** - Google OAuth with redirect flow
- **Offline Persistence** - Firebase offline caching combined with Service Worker

### Development Tools
- **TypeScript 5.4** - Latest TypeScript with full type safety
- **ESLint** - Modern linting with Angular-specific rules
- **Cypress** - End-to-end testing framework
- **ESBuild** - Fast builds with the new Angular application builder

### Performance Optimizations
- **Lazy Loading** - Route-level code splitting for optimal performance
- **Tree Shaking** - Remove unused code for smaller bundle sizes
- **Preloading Strategy** - PreloadAllModules for better navigation performance
- **Service Worker Caching** - Aggressive caching for offline-first experience
