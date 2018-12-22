// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  googleFontKey: 'AIzaSyBbShtZyuTrJ42AOqOx3d-_yJj_ykEjJV0',
  googleFontUrl: 'https://www.googleapis.com/webfonts/v1/webfonts',
  firebase: {
    apiKey: 'AIzaSyAo1c5KEL2abZlgUBJkHXrvrzsTUit4vGs',
    authDomain: 'calendar-app-nlp.firebaseapp.com',
    databaseURL: 'https://calendar-app-nlp.firebaseio.com',
    projectId: 'calendar-app-nlp',
    storageBucket: 'calendar-app-nlp.appspot.com',
    messagingSenderId: '36933045025'
  },
  calendarUser: 'test@test.com',
  calendarPassword: '123'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
