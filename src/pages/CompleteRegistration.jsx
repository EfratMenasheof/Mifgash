import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import './CompleteRegistration.css';

const locationOptions = {
  Israel: ["Jerusalem", "Tel Aviv", "Haifa", "Be'er Sheva", "Ra'anana"],
  "United States": ["New York", "Los Angeles", "Chicago", "San Francisco", "Boston"]
};

const interestOptions = ["Culture", "Technology", "Food", "History", "Music", "Politics"];

function CompleteRegistration({ setUser }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = state?.userInfo;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    country: "",
    city: "",
    bio: "",
    interests: [],
    profileImage: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const alreadySelected = prev.interests.includes(interest);
      return {
        ...prev,
        interests: alreadySelected
          ? prev.interests.filter(i => i !== interest)
          : [...prev.interests, interest]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const photoURL = user.photoURL;

      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        country: formData.country,
        city: formData.city,
        bio: formData.bio,
        interests: formData.interests,
        email: user.email,
        photo: photoURL,
        createdAt: new Date()
      });

      setUser(user);
      navigate("/home");
    } catch (err) {
      console.error("Registration error:", err.message);
    }
  };

  return (
    <div className="registration-form container mt-5">
      <h2 className="text-center mb-4">Complete Your Registration</h2>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input type="date" name="birthDate" onChange={handleChange} required />

        <select name="country" onChange={handleChange} required>
          <option value="">Select Country</option>
          {Object.keys(locationOptions).map(country => (
            <option key={country}>{country}</option>
          ))}
        </select>

        {formData.country && (
          <select name="city" onChange={handleChange} required>
            <option value="">Select City</option>
            {locationOptions[formData.country].map(city => (
              <option key={city}>{city}</option>
            ))}
          </select>
        )}

        <textarea
          name="bio"
          placeholder="Tell us a bit about yourself"
          onChange={handleChange}
        />

        <p>Select your interests:</p>
        {interestOptions.map(interest => (
          <label key={interest}>
            <input
              type="checkbox"
              checked={formData.interests.includes(interest)}
              onChange={() => handleInterestToggle(interest)}
            />
            {interest}
          </label>
        ))}

        <button type="submit" className="btn btn-success mt-3">Finish Registration</button>
      </form>
    </div>
  );
}

export default CompleteRegistration;
