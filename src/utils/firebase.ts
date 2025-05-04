// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider, signInWithPopup } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA-V4ygxvUqmejVDnuPBS4eo6Hdb0T-xes",
  authDomain: "travel-mate-4570d.firebaseapp.com",
  projectId: "travel-mate-4570d",
  storageBucket: "travel-mate-4570d.firebasestorage.app",
  messagingSenderId: "684415608404",
  appId: "1:684415608404:web:65cd1ba9f312af8101efc1",
  measurementId: "G-FYXED6H55S"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new FacebookAuthProvider();
// const analytics = getAnalytics(app);

export const facebookLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken(); // You send this to your backend
    console.log("Facebook access token from Firebase:", token);
    return token;
  } catch (error) {
    console.error("Facebook login failed:", error);
    throw error;
  }
};
