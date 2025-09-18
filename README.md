# React Native Firebase To-Do App

A complete, multi-user To-Do application built with **React Native** and **Firebase**, featuring real-time data, smooth animations, and a theme-aware UI. Designed to showcase modern mobile app development practices.

---

## ✨ Key Features

* 🔐 **Secure Firebase Authentication** for multi-user support.
* ⚡ **Real-time Data Sync** with a Cloud Firestore backend.
* 🌗 **Dynamic Dark/Light Theming** with user preferences saved to device storage.
* 👋 **Gesture-Based Controls** including a fluid "Swipe-to-Delete" feature.
* 📅 **Full Task Management** with CRUD operations and due date scheduling.
* 🚀 **Polished UX** with layout animations, task sorting, and smooth screen transitions.

---
## 📸 App Screenshots


![Login Screen](https://github.com/z-Pearlina/mobile-todo-app/blob/main/screenshots/1.jpg)
![Home Screen](https://github.com/z-Pearlina/mobile-todo-app/blob/main/screenshots/2.jpg)
![Dark-mode Screen](https://github.com/z-Pearlina/mobile-todo-app/blob/main/screenshots/4.jpg)
![Task-details Screen](https://github.com/z-Pearlina/mobile-todo-app/blob/main/screenshots/5.jpg)



(Replace the links above with your actual image URLs or GitHub uploaded images.)
---

## 🛠️ Tech Stack & Tools

**Mobile & Frontend:**
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge\&logo=expo\&logoColor=white)
![Expo Router](https://img.shields.io/badge/Expo_Router-646CFF?style=for-the-badge\&logo=react-router\&logoColor=white)
![Reanimated](https://img.shields.io/badge/Reanimated-0055D7?style=for-the-badge\&logo=react\&logoColor=white)

**Backend & Database:**
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=black)
![Firestore](https://img.shields.io/badge/Firestore-FFC107?style=for-the-badge\&logo=google-cloud\&logoColor=black)
![Firebase Auth](https://img.shields.io/badge/Auth-F57C00?style=for-the-badge\&logo=firebase\&logoColor=white)

---

## 🚀 Local Setup & Installation

Follow these steps to get the project running on your local machine.

### 1. Prerequisites

* Node.js (v18 or later)
* npm or yarn
* **Expo Go** app on your physical iOS or Android device

### 2. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install all dependencies
npm install
# or
yarn install
```

### 3. Firebase Configuration

Create a `firebaseConfig.js` file in the project's root directory. This file holds your private Firebase credentials and **should never be committed to Git**.

```javascript
// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

---
