'use client'
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { type Auth, connectAuthEmulator, getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  type Firestore,
  initializeFirestore,
} from 'firebase/firestore'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import {
  getFunctions,
  connectFunctionsEmulator,
  type Functions,
} from 'firebase/functions'
import {
  getStorage,
  connectStorageEmulator,
  type FirebaseStorage,
} from 'firebase/storage'

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth: Auth = getAuth(app)
const firestore: Firestore = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
})
let analytics: Analytics

if (typeof window !== 'undefined') {
  isSupported().then((isSupported) => {
    if (isSupported) {
      analytics = getAnalytics(app)
    } else {
      console.warn('Analytics is not supported in this environment.')
    }
  })
}

const functions: Functions = getFunctions(app)

// Storage exports
const storage: FirebaseStorage = getStorage(app)

const ip = process.env.NEXT_PUBLIC_IP_ADDRESS || '192.168.0.100'

// Connect to Firebase emulators when running locally
if (process.env.NODE_ENV === 'development') {
  app.automaticDataCollectionEnabled = false
  connectAuthEmulator(auth, `http://${ip}:9099`, { disableWarnings: true })
  connectFirestoreEmulator(firestore, ip, 8080)
  connectStorageEmulator(storage, ip, 9199)
  connectFunctionsEmulator(functions, ip, 5001)
}

export { app, auth, firestore, analytics, functions, storage }
