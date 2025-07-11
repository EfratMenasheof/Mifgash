import { useState } from 'react';
import './CompleteRegistration.css';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import InterestSelector from '../components/InterestSelector';
import { useNavigate, Link } from 'react-router-dom';
import { uploadImageToCloudinary } from '../utils/uploadToCloudinary';
import { Country, State, City } from 'country-state-city';
import Select from 'react-select';
import { israelCities } from '../data/israel_full_cities'; // ✅ הוספה

function CompleteRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    country: '',
    state: '',
    city: '',
    about: '',
    interests: [],
    learningGoal: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = [];
    const age = new Date().getFullYear() - new Date(formData.birthDate).getFullYear();
    if (age < 18) errors.push('You must be at least 18 years old to register.');
    if (!formData.firstName.trim() || !formData.lastName.trim()) errors.push('First and Last names are required.');
    if (!formData.about.trim() || formData.about.length > 200) errors.push('Tell us about yourself in 1–200 characters.');
    if (formData.interests.length < 2) errors.push('Please select at least 2 interests.');
    if (!imageFile) errors.push('Please upload a profile picture.');
    return errors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const getCoordinates = async (locationString) => {
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(locationString)}&key=${apiKey}`);
    const data = await response.json();
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { lat, lng };
    }
    return null;
  };

  const handleCountryChange = (selectedOption) => {
    const value = selectedOption.value;
    setFormData((prev) => ({
      ...prev,
      country: value,
      state: '',
      city: ''
    }));

    if (value === 'US') {
      const newStates = State.getStatesOfCountry(value);
      setStates(newStates);
      setCities([]);
    } else if (value === 'IL') {
      setStates([]);
      setCities(israelCities.map(name => ({ name }))); // ✅ שימוש ברשימה מ־JS
    }
  };

  const handleStateChange = (selectedOption) => {
    const value = selectedOption.value;
    setFormData((prev) => ({
      ...prev,
      state: value,
      city: ''
    }));
    const newCities = City.getCitiesOfState('US', value);
    setCities(newCities);
  };

  const handleCityChange = (selectedOption) => {
    const value = selectedOption.value;
    setFormData((prev) => ({
      ...prev,
      city: value
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length) return alert(errors.join('\n'));

    setUploading(true);
    try {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('User not authenticated');

      const imageUrl = await uploadImageToCloudinary(imageFile);

      const locationString =
        formData.country === 'IL'
          ? `${formData.city}, Israel`
          : `${formData.city}, ${formData.state}, United States`;

      const coordinates = await getCoordinates(locationString);

      const locationData =
        formData.country === 'IL'
          ? {
              country: 'Israel',
              city: formData.city,
              coordinates
            }
          : {
              country: 'United States',
              state: formData.state,
              city: formData.city,
              coordinates
            };

      await setDoc(doc(db, 'users', uid), {
  uid,
  email: auth.currentUser.email,
  fullName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
  birthDate: formData.birthDate,
  location: locationData,
  about: formData.about,
  interests: formData.interests,
  profileImage: imageUrl,
  learningGoal: formData.learningGoal,
  sentRequests: [],
  receivedRequests: [],
  friends: []
}, { merge: true });

      alert('Registration complete!');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
    setUploading(false);
  };

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <input type="text" name="firstName" placeholder="First Name*" value={formData.firstName} onChange={handleChange} required />
        <input type="text" name="middleName" placeholder="Middle Name (optional)" value={formData.middleName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name*" value={formData.lastName} onChange={handleChange} required />

        <label>Birth Date*</label>
        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />

        <label>Country</label>
        <Select
          options={[
            { value: 'IL', label: 'Israel' },
            { value: 'US', label: 'United States' }
          ]}
          onChange={handleCountryChange}
          placeholder="Select your country"
        />

        {formData.country === 'US' && (
          <>
            <label>State</label>
            <Select
              options={states.map((s) => ({ value: s.isoCode, label: s.name }))}
              onChange={handleStateChange}
              placeholder="Select your state"
            />
          </>
        )}

        {cities.length > 0 && (
          <>
            <label>City</label>
            <Select
              options={cities.map((c) => ({ value: c.name, label: c.name }))}
              onChange={handleCityChange}
              placeholder="Select your city"
            />
          </>
        )}

        <label>Tell us a bit about yourself:</label>
        <div className="textarea-wrapper">
          <textarea
            name="about"
            placeholder="Tell us a bit about yourself"
            value={formData.about}
            onChange={handleChange}
            required
            maxLength={200}
          />
          <span className="char-counter">{formData.about.length}/200</span>
        </div>

        <label>I'm looking to learn:</label>
        <select name="learningGoal" value={formData.learningGoal} onChange={handleChange} required>
          <option value="">Choose one</option>
          <option value="English">English</option>
          <option value="Hebrew">Hebrew</option>
        </select>

        <InterestSelector
          selectedInterests={formData.interests}
          setSelectedInterests={(interests) =>
            setFormData((prev) => ({ ...prev, interests }))
          }
        />

        <label>Upload a profile picture:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} required />

        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? 'Submitting...' : 'Finish Registration'}
        </button>

        <p className="login-link">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </form>
    </div>
  );
}

export default CompleteRegistration;
