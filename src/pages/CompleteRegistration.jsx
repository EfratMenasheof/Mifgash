import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { uploadImageToCloudinary } from "../utils/uploadToCloudinary";
import Select from "react-select";
import { State, City } from "country-state-city";
import interestsData from "../data/Interests_Categories.json";
import { israelCities } from "../data/israel_full_cities";
import MIFGASH_LOGO from "../assets/MIFGASH_LOGO.png";
import "./CompleteRegistration.css";

export default function CompleteRegistration({ onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    country: "",
    state: "",
    city: "",
    about: "",
    learningGoal: "",
    interests: [],
    whatsappCountryCode: "+972",
    whatsappNumber: "",
    showEmail: false,
    showPhone: false,
  });
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    about: "",
    whatsappNumber: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);

  // जब देश बदलता है, लोड करें States/​Cities
  useEffect(() => {
    if (formData.country === "US") {
      setStates(State.getStatesOfCountry("US"));
      setCities([]);
    } else if (formData.country === "IL") {
      setStates([]);
      setCities(israelCities.map(name => ({ name })));
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.country]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // שמות באנגלית בלבד
    if (["firstName", "middleName", "lastName"].includes(name)) {
      const englishOnly = /^[A-Za-z]*$/;
      setFieldErrors(prev => ({
        ...prev,
        [name]:
          value && !englishOnly.test(value)
            ? "Please use only English letters."
            : "",
      }));
    }
    // גיל (≥18)
    if (name === "birthDate") {
      let err = "";
      if (value) {
        const birth = new Date(value),
          now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
          age--;
        }
        if (age < 18) err = "You must be at least 18 years old.";
      }
      setFieldErrors(prev => ({ ...prev, birthDate: err }));
    }
    // About: ASCII בלבד
    if (name === "about") {
      const asciiOnly = /^[\x20-\x7E\u2019]*$/;
      setFieldErrors(prev => ({
        ...prev,
        about:
          value && !asciiOnly.test(value)
            ? "Please use only English letters, numbers and punctuation."
            : "",
      }));
    }
    if (name === "whatsappNumber") {
      let err = "";
      // 1) רק ספרות
      if (value && /[^0-9]/.test(value)) {
        err = "Please enter numbers only.";
      }
      // 2) אם ישראל, לא מתחיל 0
      else if (
        formData.whatsappCountryCode === "+972" &&
        value.startsWith("0")
      ) {
        err = "Do not start with 0; enter the rest of your number.";
      }
      // 3) אם ישראל, בדיוק 9 ספרות
      else if (
        formData.whatsappCountryCode === "+972" &&
        value &&
        value.length !== 9
      ) {
        err = "Phone number must be exactly 9 digits.";
      }
      setFieldErrors((prev) => ({ ...prev, whatsappNumber: err }));
    }
  };

  const handleCountryChange = opt => {
    setFormData(prev => ({
      ...prev,
      country: opt.value,
      state: "",
      city: "",
    }));
  };
  const handleStateChange = opt => {
    setFormData(prev => ({
      ...prev,
      state: opt.value,
      city: "",
    }));
    setCities(City.getCitiesOfState("US", opt.value));
  };
  const handleCityChange = opt => {
    setFormData(prev => ({ ...prev, city: opt.value }));
  };
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };

  // בדיקות נוספות לפני שליחה
  const validateForm = () => {
    const errors = [];
    if (!formData.firstName.trim() || !formData.lastName.trim())
      errors.push("First and Last names are required.");
    if (fieldErrors.birthDate) errors.push(fieldErrors.birthDate);

    if (!formData.about.trim())
      errors.push("Tell us a bit about yourself.");
    else if (formData.about.length > 200)
      errors.push("About section must be at most 200 characters.");
    else if (/[^\x20-\x7E\u2019]/.test(formData.about))
      errors.push(
        "Please use only English letters, numbers and common punctuation."
      );

    if (formData.interests.length < 2)
      errors.push("Please select at least 2 interests.");
    if (!imageFile) errors.push("Please upload a profile picture.");

    // אם סימנתי “Show my phone” — גם מספר חובה
    if (formData.showPhone && !formData.whatsappNumber.trim())
      errors.push("Please enter your phone number.");
    if (!formData.showEmail && !formData.showPhone) {
      errors.push("Please choose to show your email and/or phone.");
    }
    // 2) אם בחר phone – חובה למלא ולתקן
    if (formData.showPhone) {
      if (!formData.whatsappNumber.trim()) {
        errors.push("Please enter your phone number.");
      }
      if (fieldErrors.whatsappNumber) {
        errors.push(fieldErrors.whatsappNumber);
      }
    }
      return errors;
    };

  const getCoordinates = async loc => {
    const key = import.meta.env.VITE_OPENCAGE_API_KEY;
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        loc
      )}&key=${key}`
    );
    const data = await res.json();
    return data.results[0]?.geometry || null;
  };

  const toggleCategory = cat => {
    setExpandedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };
  const toggleTag = name => {
    setFormData(prev => {
      const ints = prev.interests.includes(name)
        ? prev.interests.filter(i => i !== name)
        : [...prev.interests, name];
      return { ...prev, interests: ints };
    });
  };

  // האם אפשר ללחוץ על Finish?
  const isFormValid =
    !uploading &&
    !Object.values(fieldErrors).some(Boolean) &&
    (formData.showEmail || formData.showPhone) &&
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.birthDate &&
    formData.country &&
    formData.city &&
    formData.about.trim() &&
    formData.learningGoal &&
    formData.interests.length >= 2 &&
    imageFile &&
    (!formData.showPhone ||
      (formData.whatsappNumber.trim() && !fieldErrors.whatsappNumber));
  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length) return alert(errors.join("\n"));
    setUploading(true);
    try {
      const auth = getAuth(),
        uid = auth.currentUser?.uid;
      const imageUrl = await uploadImageToCloudinary(imageFile);

      const locStr =
        formData.country === "IL"
          ? `${formData.city}, Israel`
          : `${formData.city}, ${formData.state}, United States`;
      const coords = await getCoordinates(locStr);
      const locationData =
        formData.country === "IL"
          ? { country: "Israel", city: formData.city, coordinates: coords }
          : {
              country: "United States",
              state: formData.state,
              city: formData.city,
              coordinates: coords,
            };

      await setDoc(
        doc(db, "users", uid),
        {
          ...formData,
         phone: formData.showPhone
           ? `${formData.whatsappCountryCode}${formData.whatsappNumber}`
           : "",
          profileImage: imageUrl,
          location: locationData,
        },
        { merge: true }
      );
      alert("Registration complete!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
    setUploading(false);
  };

  return (
    <div className="complete-registration">
      <div className="modal-overlay">
        <div className="match-modal registration-container">
          <button className="modal-close-button" onClick={onClose}>
            ✕
          </button>
          <h2 className="modal-title">
            Welcome to{" "}
            <img
              src={MIFGASH_LOGO}
              alt="Mifgash Logo"
              className="logo-inline"
            />
          </h2>
          <p className="modal-subtitle">
            A platform that brings Israelis and American Jews together for
            language exchange and meaningful connections.
          </p>
          <p className="modal-subtext">Let’s get you signed up!</p>

          <form className="registration-form" onSubmit={handleSubmit}>
            {/* Names */}
            <label>
              First Name
              <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {fieldErrors.firstName && (
              <div className="error-text">{fieldErrors.firstName}</div>
            )}

            <label>
              Middle Name<span className="required-asterisk"></span> (optional)
            </label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
            {fieldErrors.middleName && (
              <div className="error-text">{fieldErrors.middleName}</div>
            )}

            <label>
              Last Name
              <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {fieldErrors.lastName && (
              <div className="error-text">{fieldErrors.lastName}</div>
            )}

            {/* Birth Date */}
            <label>
              Birth Date
              <span className="required-asterisk">*</span>
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
            {fieldErrors.birthDate && (
              <div className="error-text">{fieldErrors.birthDate}</div>
            )}

            {/* Country / State / City */}
            <label>
              Country
              <span className="required-asterisk">*</span>
            </label>
            <Select
              options={[
                { value: "IL", label: "Israel 🇮🇱" },
                { value: "US", label: "United States 🇺🇸" },
              ]}
              onChange={handleCountryChange}
              placeholder="Select your country"
            />
            {formData.country === "US" && (
              <>
                <label>
                  State
                  <span className="required-asterisk">*</span>
                </label>
                <Select
                  options={states.map((s) => ({
                    value: s.isoCode,
                    label: s.name,
                  }))}
                  onChange={handleStateChange}
                  placeholder="Select your state"
                />
              </>
            )}
            {cities.length > 0 && (
              <>
                <label>
                  City
                  <span className="required-asterisk">*</span>
                </label>
                <Select
                  options={cities.map((c) => ({
                    value: c.name,
                    label: c.name,
                  }))}
                  onChange={handleCityChange}
                  placeholder="Select your city"
                />
              </>
            )}

            {/* About */}
            <label>
              Tell us a bit about yourself
              <span className="required-asterisk">*</span>
            </label>
            <div className="textarea-wrapper">
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                required
                maxLength={200}
              />
              <span className="char-counter">
                {formData.about.length}/200
              </span>
            </div>
            {fieldErrors.about && (
              <div className="error-text">{fieldErrors.about}</div>
            )}

            {/* Learning Goal */}
            <label>
              I’m looking to practice
              <span className="required-asterisk">*</span>
            </label>
            <div className="learning-goal-toggle">
              <button
                type="button"
                className={
                  formData.learningGoal === "English" ? "active" : ""
                }
                onClick={() =>
                  setFormData((p) => ({ ...p, learningGoal: "English" }))
                }
              >
                English
              </button>
              <button
                type="button"
                className={
                  formData.learningGoal === "Hebrew" ? "active" : ""
                }
                onClick={() =>
                  setFormData((p) => ({ ...p, learningGoal: "Hebrew" }))
                }
              >
                Hebrew
              </button>
            </div>

            {/* Interests */}
            <label>
              What topics interest you?
              <span className="required-asterisk">*</span>
            </label>
            <div className="interests-scroll">
              {Object.entries(interestsData).map(
                ([category, { emoji, items }]) => {
                  const expanded = expandedCategories.includes(category);
                  return (
                    <div
                      key={category}
                      className="interest-category modern"
                    >
                      <button
                        type="button"
                        className="category-header-modern"
                        onClick={() => toggleCategory(category)}
                      >
                        <span>
                          {emoji} {category}
                        </span>
                        <span className="arrow">
                          {expanded ? "▾" : "▸"}
                        </span>
                      </button>
                      <div
                        className={`category-tags-modern ${
                          expanded ? "expanded" : ""
                        }`}
                      >
                        {items.map(({ name, emoji }) => {
                          const sel =
                            formData.interests.includes(name);
                          return (
                            <button
                              key={name}
                              type="button"
                              className={`tag ${
                                sel ? "selected" : ""
                              }`}
                              onClick={() => toggleTag(name)}
                            >
                              <span className="interest-emoji">
                                {emoji}
                              </span>
                              {name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Profile Picture */}
            <label>
              Upload a profile picture
              <span className="required-asterisk">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />

            {/* Contact Info */}
            <h3 className="section-title contact-title">
              Contact Info
            </h3>
            <p className="section-description">
              Choose what your matches can see.
            </p>
            <div className="contact-toggles">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="showEmail"
                  checked={formData.showEmail}
                  onChange={handleChange}
                />
                Show my email
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="showPhone"
                  checked={formData.showPhone}
                  onChange={handleChange}
                />
                Show my phone
              </label>
            </div>
            {formData.showPhone && (
              <div className="phone-input-group">
                {/* רק אם בחרת קוד ישראלי */}
                {formData.whatsappCountryCode === "+972" && (
                  <div className="input-note">
                    For Israeli numbers that start with 05…, skip the leading zero.
                    For example, if your number is 051‑2345678, enter 512345678.
                  </div>
                )}

                {/* country code */}
                <select
                  name="whatsappCountryCode"
                  value={formData.whatsappCountryCode}
                  onChange={handleChange}
                >
                  <option value="+972">🇮🇱 +972</option>
                  <option value="+1">🇺🇸 +1</option>
                </select>

                {/* actual phone number */}
                <input
                  type="tel"
                  name="whatsappNumber"
                  placeholder="Phone number"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  required
                />

                {/* שגיאת whatsappNumber */}
                {fieldErrors.whatsappNumber && (
                  <div className="error-text">
                    {fieldErrors.whatsappNumber}
                  </div>
                )}
              </div>
            )}




            {/* Submit */}
            <button
              type="submit"
              className="submit-btn"
              disabled={!isFormValid}
            >
              {uploading ? "Submitting..." : "Finish Registration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
