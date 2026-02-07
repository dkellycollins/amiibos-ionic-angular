# Key Features - Amiibos Ionic Angular

## Overview
A mobile-first Progressive Web App (PWA) for tracking and managing personal Amiibo figure and card collections.

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
- **Google Sign-In** - OAuth authentication via Google (using Capacitor Firebase Auth plugin)
- **Guest Mode** - Use the app without signing in (data stored locally)
- **Cloud Sync for Authenticated Users** - Collection data automatically synced to Firebase Firestore when logged in
- **Local Storage Fallback** - Guest users have their collection saved in browser localStorage
- **Automatic Data Migration** - When a guest user logs in, their collection can be transferred to the cloud
- **Platform-Specific Auth** - Uses native Google Sign-In on Android, web-based redirect on other platforms

### 4. User Interface
- **Side Menu Navigation** - Hamburger menu with:
  - User profile display (photo, name, or "Guest")
  - Login/Logout actions
  - Quick navigation to Figures or Cards collections
  - App version display
- **Amiibo Item Display** - Each amiibo shows:
  - Thumbnail image
  - Name and series
  - Description (expandable)
  - Collection toggle switch
- **Responsive Design** - Built with Ionic components for mobile-first experience
- **Progress Toolbar** - Persistent footer showing collection completion stats

### 5. Progressive Web App (PWA)
- **Offline Support** - Angular Service Worker enables offline functionality in production
- **Install to Home Screen** - Can be installed as a standalone app on mobile devices
- **App Manifest** - Configured for native-like installation experience

### 6. Cross-Platform Support
- **Web Browser** - Runs in any modern web browser
- **Android Native** - Capacitor integration for native Android app
- **Hybrid Architecture** - Single codebase deploys to web and mobile platforms

## Data Architecture

### Real-Time Sync
- Firestore collections stream updates in real-time to the app
- Changes to collection status immediately sync across devices for authenticated users
- NGXS state management provides reactive data flow throughout the application

### Data Models
- **Amiibo Data** - Includes slug, name, description, series, type, figure URL, release date
- **User Collection Data** - Links user UID to amiibo slug with collection status
- **Collection Progress** - Calculated dynamically from selected filters and user collection

## Technical Highlights

- **State Management** - NGXS with Firestore plugin for declarative data flow
- **Reactive Programming** - RxJS observables throughout for reactive UI updates
- **Firebase Integration** - Real-time database with offline persistence
- **Modular Architecture** - Feature modules (Auth, Amiibos, Core) for scalability
- **TypeScript** - Fully typed codebase for maintainability
- **Lazy Loading** - Route-level code splitting for optimal performance
