import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Log the environment variables (without sensitive values)
console.log('Environment check:', {
  hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
  hasAuthDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  hasProjectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
  hasStorageBucket: !!process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  hasMessagingSenderId: !!process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  hasAppId: !!process.env.REACT_APP_FIREBASE_APP_ID
});

// Initialize Firebase
let app;
let db;

try {
  // Check if all required environment variables are present
  const missingVars = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('Missing Firebase configuration variables:', missingVars);
    throw new Error(`Missing Firebase configuration variables: ${missingVars.join(', ')}`);
  }

  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Provide a mock database for development
  db = {
    collection: () => ({
      where: () => ({
        orderBy: () => ({
          getDocs: async () => ({
            empty: false,
            docs: [{
              id: '1',
              data: () => ({
                text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
                reference: "John 3:16",
                approved: true,
                date: new Date().toISOString().split('T')[0]
              })
            }]
          })
        })
      })
    }),
    doc: () => ({
      updateDoc: async () => console.log('Mock updateDoc called')
    })
  };
}

export { db };
export const auth = getAuth(app); 