import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./Login.css";

function Login({ setUser }) {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(user);
        navigate("/home");
      } else {
        navigate("/complete-registration", {
          state: {
            userInfo: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL
            }
          }
        });
      }
    } catch (error) {
      console.error("❌ Login error:", error.message);
    }
  };

  return (
    <div className="login-page container text-center mt-5">
      <h2 className="welcome-title mb-4">Welcome to Mifgash</h2>
      <p className="homepage-subtitle mb-4">Please sign in or sign up using Google</p>
      <button className="btn btn-warning btn-lg" onClick={handleGoogleLogin}>
        Sign in / Sign up with Google
      </button>
    </div>
  );
}

export default Login;
