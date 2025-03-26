# Agape Daily Verse

A web application for displaying and managing daily Bible verses. Built with React and Firebase.

## Features

- Display daily Bible verses
- Submit new verses for approval
- Admin dashboard for managing submissions
- Responsive design for all devices

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account and project

## Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd agape-daily-verse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication and Firestore
   - Create a web app in your project
   - Copy the Firebase configuration

4. Configure Firebase:
   - Open `src/firebase.js`
   - Replace the placeholder configuration with your Firebase config

5. Set up Firebase Authentication:
   - In Firebase Console, go to Authentication
   - Enable Email/Password authentication
   - Create an admin user

6. Set up Firestore:
   - In Firebase Console, go to Firestore
   - Create a new database
   - Set up security rules:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /verses/{verseId} {
           allow read: if true;
           allow write: if request.auth != null;
         }
       }
     }
     ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to Firebase Hosting:
   ```bash
   firebase deploy
   ```

3. Configure your domain:
   - In Firebase Console, go to Hosting
   - Add your custom domain (daily.agape-wear.com)
   - Follow the DNS configuration instructions

## Project Structure

```
src/
  ├── components/
  │   ├── DailyVerse.js    # Displays the current day's verse
  │   ├── SubmitVerse.js   # Form for submitting new verses
  │   └── Admin.js         # Admin dashboard for managing verses
  ├── firebase.js          # Firebase configuration
  ├── App.js               # Main application component
  └── App.css              # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 