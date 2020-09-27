import { version } from '../../package.json';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  version,
  firebase: {
    apiKey: 'AIzaSyB5m7Y9MdL1VkIlCZf7u36deIJjvUrmqZg',
    authDomain: 'amiibos-firebase.firebaseapp.com',
    databaseURL: 'https://amiibos-firebase.firebaseio.com',
    projectId: 'amiibos-firebase',
    storageBucket: '',
    messagingSenderId: '247074249215',
    appId: '1:247074249215:web:ce0062ec9c0b7e8edaafca'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
