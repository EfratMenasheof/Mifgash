import React from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import mifgashLogo from "../assets/MIFGASH.png";
import styles from "./Login.module.css";

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
      <div className="container text-center mt-5">
        <img
  src={mifgashLogo}
  alt="Mifgash Logo"
  style={{ width: "260px", marginBottom: "30px" }} // תמונה גדולה יותר
/>

<h2
  className={`${styles.welcomeTitle} mb-4`}
  style={{ fontSize: "3rem" }} // כותרת גדולה יותר
>
  Welcome to Mifgash
</h2>

<p
  className={`${styles.homepageSubtitle} mb-4`}
  style={{ fontSize: "1.8rem" }} // פסקה גדולה יותר
>
  Bringing our people closer, one word at a time.
</p>

      <div className="d-flex justify-content-center gap-4">
        <button
  className={`${styles.loginButton} ${styles.signInButton}`}
  onClick={handleSignIn}
>
  Sign In with Google
</button>

<button
  className={`${styles.loginButton} ${styles.signUpButton}`}
  onClick={handleSignUp}
>
  Sign Up with Google
</button>

      </div>
    </div>
  );
}

export default Login;
