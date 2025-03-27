export interface Verse {
  id: string;
  text: string;
  reference: string;
  approved: boolean;
  date: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
} 