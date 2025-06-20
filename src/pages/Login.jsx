import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./Login.css";

function Login({ setUser }) {
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(user);
        navigate("/home");
      } else {
        alert("No account found. Please Sign Up first.");
      }
    } catch (error) {
      console.error("❌ Sign In error:", error.message);
    }
  };

  const handleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setUser(user);
        navigate("/register", {
          state: {
            userInfo: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
          },
        });
      } else {
        alert("User already exists. Please Sign In.");
      }
    } catch (error) {
      console.error("❌ Sign Up error:", error.message);
    }
  };

  return (
    <div className="login-page container text-center mt-5">
      <h2 className="welcome-title mb-4">Welcome to Mifgash</h2>
      <p className="homepage-subtitle mb-4">Please choose how you'd like to continue</p>

      <div className="d-flex justify-content-center gap-4">
        <button className="btn btn-outline-primary btn-lg" onClick={handleSignIn}>
          Sign In with Google
        </button>

        <button className="btn btn-primary btn-lg" onClick={handleSignUp}>
          Sign Up with Google
        </button>
      </div>
    </div>
  );
}

export default Login;