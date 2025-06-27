import { useState } from 'react';
import './CompleteRegistration.css';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import InterestSelector from '../components/InterestSelector';
import { useNavigate, Link } from 'react-router-dom';
import { uploadImageToCloudinary } from '../utils/uploadToCloudinary';
import { Country, State, City } from 'country-state-city';

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'country') {
      const selectedCountry = Country.getCountryByCode(value);
      setFormData((prev) => ({
        ...prev,
        country: value,
        state: '',
        city: ''
      }));
      const newStates = State.getStatesOfCountry(value);
      setStates(newStates);
      setCities([]);
    } else if (name === 'state') {
      setFormData((prev) => ({
        ...prev,
        state: value,
        city: ''
      }));
      const newCities = City.getCitiesOfState(formData.country, value);
      setCities(newCities);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

      await setDoc(doc(db, 'users', uid), {
        uid,
        email: auth.currentUser.email,
        fullName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
        birthDate: formData.birthDate,
        location:
          formData.country === "IL"
            ? {
                country: "Israel",
                city: formData.city
              }
            : {
                country: "United States",
                state: formData.state,
                city: formData.city
              },
        about: formData.about,
        interests: formData.interests,
        profileImage: imageUrl,
        learningGoal: formData.learningGoal,
        sentRequests: [],
        receivedRequests: [],
        friends: []
      });

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

        <label>Where are you from?</label>
        <select name="country" onChange={handleChange} required>
          <option value="">Select your country</option>
          <option value="IL">Israel</option>
          <option value="US">United States</option>
        </select>

        {states.length > 0 && (
          <select name="state" value={formData.state} onChange={handleChange} required>
            <option value="">Select your state</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
            ))}
          </select>
        )}

        {cities.length > 0 && (
          <select name="city" value={formData.city} onChange={handleChange} required>
            <option value="">Select your city</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
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
