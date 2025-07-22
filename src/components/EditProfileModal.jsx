// src/components/EditProfileModal.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { uploadImageToCloudinary } from "../utils/uploadToCloudinary";
import Select from "react-select";
import { State, City } from "country-state-city";
import interestsData from "../data/Interests_Categories.json";
import { israelCities } from "../data/israel_full_cities";
import "../pages/CompleteRegistration.css";

export default function EditProfileModal({ userData, onClose }) {
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
    whatsappNumber: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);

  // 1. Prefill formData when userData arrives
  useEffect(() => {
    if (!userData) return;
    const loc = userData.location || {};
    setFormData({
      firstName: userData.firstName || "",
      middleName: userData.middleName || "",
      lastName: userData.lastName || "",
      birthDate: userData.birthDate || "",
      country: loc.country === "Israel" ? "IL" : "US",
      state: loc.state || "",
      city: loc.city || "",
      about: userData.about || "",
      learningGoal: userData.learningGoal || "",
      interests: userData.interests || [],
      whatsappCountryCode: userData.whatsappCountryCode || "+972",
      whatsappNumber: userData.whatsappNumber || "",
      showEmail: userData.showEmail || false,
      showPhone: userData.showPhone || false,
    });
    setImageFile(null);
    setFieldErrors({
      firstName: "",
      middleName: "",
      lastName: "",
      birthDate: "",
      about: "",
      whatsappNumber: "",
    });
  }, [userData]);

  // 2. Load states/cities on country change
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

  // 3. Handlers for input changes with inline validation
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // English letters only for names
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
    // Age ≥ 18
    if (name === "birthDate") {
      let err = "";
      if (value) {
        const birth = new Date(value);
        const now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
          age--;
        }
        if (age < 18) err = "You must be at least 18 years old.";
      }
      setFieldErrors(prev => ({ ...prev, birthDate: err }));
    }
    // About ASCII only
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
    // WhatsApp number validation
    if (name === "whatsappNumber") {
      let err = "";
      if (value && /[^0-9]/.test(value)) {
        err = "Please enter numbers only.";
      } else if (
        formData.whatsappCountryCode === "+972" &&
        value.startsWith("0")
      ) {
        err = "Do not start with 0; enter the rest of your number.";
      } else if (
        formData.whatsappCountryCode === "+972" &&
        value &&
        value.length !== 9
      ) {
        err = "Phone number must be exactly 9 digits.";
      }
      setFieldErrors(prev => ({ ...prev, whatsappNumber: err }));
    }
  };

  const handleCountryChange = opt =>
    setFormData(prev => ({ ...prev, country: opt.value, state: "", city: "" }));
  const handleStateChange = opt => {
    setFormData(prev => ({ ...prev, state: opt.value, city: "" }));
    setCities(City.getCitiesOfState("US", opt.value));
  };
  const handleCityChange = opt =>
    setFormData(prev => ({ ...prev, city: opt.value }));
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
  };
  const toggleInterest = name =>
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(name)
        ? prev.interests.filter(i => i !== name)
        : [...prev.interests, name],
    }));
  const toggleCategory = cat =>
    setExpandedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  // 4. Validate before submit
  const validateForm = () => {
    const errors = [];
    if (!formData.firstName.trim() || !formData.lastName.trim())
      errors.push("First and Last names are required.");
    if (fieldErrors.birthDate) errors.push(fieldErrors.birthDate);

    if (!formData.about.trim())
      errors.push("Tell us a bit about yourself.");
    else if (formData.about.length > 200)
      errors.push("About section must be at most 200 characters.");
    else if (/[^^\x20-\x7E\u2019]/.test(formData.about))
      errors.push(
        "Please use only English letters, numbers and common punctuation."
      );

    if (formData.interests.length < 2)
      errors.push("Please select at least 2 interests.");
    if (!imageFile && !userData.profileImage)
      errors.push("Please upload a profile picture.");

    if (formData.showPhone && !formData.whatsappNumber.trim())
      errors.push("Please enter your phone number.");
    if (!formData.showEmail && !formData.showPhone)
      errors.push("Please choose to show your email and/or phone.");
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

  // 5. Check form validity
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
    (imageFile || userData.profileImage) &&
    (!formData.showPhone ||
      (formData.whatsappNumber.trim() && !fieldErrors.whatsappNumber));

  // 6. Submit handler
  const handleSubmit = async e => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length) {
      alert(errors.join("\n"));
      return;
    }
    setUploading(true);
    try {
      const uid = auth.currentUser.uid;
      const imageUrl = imageFile
        ? await uploadImageToCloudinary(imageFile)
        : userData.profileImage;

      const locStr =
        formData.country === "IL"
          ? `${formData.city}, Israel`
          : `${formData.city}, ${formData.state}, United States`;
      const geo = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          locStr
        )}&key=${import.meta.env.VITE_OPENCAGE_API_KEY}`
      ).then(r => r.json());
      const coords = geo.results[0]?.geometry || null;
      const locationData =
        formData.country === "IL"
          ? { country: "Israel", city: formData.city, coordinates: coords }
          : {
              country: "United States",
              state: formData.state,
              city: formData.city,
              coordinates: coords,
            };

      const fullName = [
        formData.firstName,
        formData.middleName,
        formData.lastName,
      ]
        .filter(Boolean)
        .join(" ");

      const updateData = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        fullName,
        birthDate: formData.birthDate,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        about: formData.about,
        learningGoal: formData.learningGoal,
        interests: formData.interests,
        profileImage: imageUrl,
        location: locationData,
        showEmail: formData.showEmail,
        showPhone: formData.showPhone,
        ...(formData.showPhone && {
          phone: `${formData.whatsappCountryCode}${formData.whatsappNumber}`,
        }),
      };

      await setDoc(doc(db, "users", uid), updateData, { merge: true });
      alert("Profile updated!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong updating your profile.");
    }
    setUploading(false);
  };

  return (
    <div className="complete-registration">
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="match-modal registration-container"
          onClick={e => e.stopPropagation()}
        >
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
          >
            ✕
          </button>
          <h2 className="modal-title">Edit Your Profile</h2>

          {/* Profile Picture */}
          <div
            className="profile-pic-wrapper"
            style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}
          >
            <input
              type="file"
              id="profilePicInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <label htmlFor="profilePicInput">
              <img
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : userData.profileImage
                }
                alt="Profile"
                className="profile-pic-circle"
                style={{ width: "80px", height: "80px", cursor: "pointer" }}
              />
            </label>
          </div>

          <form className="registration-form" onSubmit={handleSubmit}>
            {/* First/Middle/Last Name */}
            <label>First Name<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            {fieldErrors.firstName && (
              <div className="error-text">{fieldErrors.firstName}</div>
            )}
            <label>Middle Name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
            {fieldErrors.middleName && (
              <div className="error-text">{fieldErrors.middleName}</div>
            )}
            <label>Last Name<span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            {fieldErrors.lastName && (
              <div className="error-text">{fieldErrors.lastName}</div>
            )}
            

            {/* Birth Date */}
            <label>Birth Date<span className="required-asterisk">*</span></label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
            {fieldErrors.birthDate && (
              <div className="error-text">{fieldErrors.birthDate}</div>
            )}

            {/* Country / State / City */}
            <label>Country<span className="required-asterisk">*</span></label>
            <Select
              options={[
                { value: "IL", label: "Israel 🇮🇱" },
                { value: "US", label: "United States 🇺🇸" },
              ]}
              value={{ value: formData.country, label: formData.country === "IL" ? "Israel 🇮🇱" : "United States 🇺🇸" }}
              onChange={handleCountryChange}
            />
            {formData.country === "US" && (
              <>
                <label>State<span className="required-asterisk">*</span></label>
                <Select
                  options={states.map(s => ({ value: s.isoCode, label: s.name }))}
                  value={states.find(s => s.isoCode === formData.state) ? { value: formData.state, label: states.find(s => s.isoCode === formData.state).name } : null}
                  onChange={handleStateChange}
                />
              </>
            )}
            {cities.length > 0 && (
              <>
                <label>City<span className="required-asterisk">*</span></label>
                <Select
                  options={cities.map(c => ({ value: c.name, label: c.name }))}
                  value={formData.city ? { value: formData.city, label: formData.city } : null}
                  onChange={handleCityChange}
                />
              </>
            )}

            {/* About */}
            <label>About<span className="required-asterisk">*</span></label>
            <div className="textarea-wrapper">
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                maxLength={200}
              />
              <span className="char-counter">{formData.about.length}/200</span>
            </div>
            {fieldErrors.about && (
              <div className="error-text">{fieldErrors.about}</div>
            )}

            {/* Remaining form fields unchanged */}
            {/* … */}
            {/* Interests Section */}
            <label>What topics interest you?<span className="required-asterisk">*</span></label>
            <div className="interests-scroll">
              {Object.entries(interestsData).map(([category, { emoji, items }]) => {
                const expanded = expandedCategories.includes(category);
                return (
                  <div key={category} className="interest-category modern">
                    <button
                      type="button"
                      className="category-header-modern"
                      onClick={() => toggleCategory(category)}
                    >
                      <span>{emoji} {category}</span>
                      <span className="arrow">{expanded ? "▾" : "▸"}</span>
                    </button>
                    <div className={`category-tags-modern ${expanded ? "expanded" : ""}`}>
                      {items.map(({ name, emoji }) => {
                        const selected = formData.interests.includes(name);
                        return (
                          <button
                            key={name}
                            type="button"
                            className={`tag ${selected ? "selected" : ""}`}
                            onClick={() => toggleInterest(name)}
                          >
                            <span className="interest-emoji">{emoji}</span> {name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Contact Info Section */}
            <h3 className="section-title contact-title">Contact Info</h3>
            <p className="section-description">Choose what your matches can see.</p>
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
                {formData.whatsappCountryCode === "+972" && (
                  <div className="input-note">
                    For Israeli numbers that start with 05…, skip the leading zero. E.g., 051‑2345678 → enter 512345678.
                  </div>
                )}
                <select
                  name="whatsappCountryCode"
                  value={formData.whatsappCountryCode}
                  onChange={handleChange}
                >
                  <option value="+972">🇮🇱 +972</option>
                  <option value="+1">🇺🇸 +1</option>
                </select>
                <input
                  type="tel"
                  name="whatsappNumber"
                  placeholder="Phone number"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.whatsappNumber && (
                  <div className="error-text">{fieldErrors.whatsappNumber}</div>
                )}
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={!isFormValid}> {uploading ? "Saving..." : "Save Changes"} </button>
          </form>
        </div>
      </div>
    </div>
  );
}
