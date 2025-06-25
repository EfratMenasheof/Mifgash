import { useState } from 'react';
import './CompleteRegistration.css';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import InterestSelector from '../components/InterestSelector';
import { useNavigate, Link } from 'react-router-dom';
import { uploadImageToCloudinary } from '../utils/uploadToCloudinary'; // חדש

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

  const [imageFile, setImageFile] = useState(null); // חדש
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const isEnglish = (text) => /^[A-Za-z0-9 .,!?'"@#$%^&*()_\-+=\[\]{}:;|<>/~`\\]*$/.test(text);
  const validateForm = () => {
    const errors = [];

    const age = new Date().getFullYear() - new Date(formData.birthDate).getFullYear();
    if (age < 18) errors.push('You must be at least 18 years old to register.');
    if (!formData.firstName.trim() || !formData.lastName.trim()) errors.push('First and Last names are required.');
    if (!isEnglish(formData.firstName + formData.middleName + formData.lastName)) errors.push('Names must be in English.');
    if (!formData.about.trim() || formData.about.length > 200) errors.push('Tell us about yourself in 1–200 English characters.');
    if (!isEnglish(formData.about)) errors.push('"About you" section must be in English.');
    if (formData.interests.length < 2) errors.push('Please select at least 2 interests.');
    if (!imageFile) errors.push('Please upload a profile picture.');

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
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

      // שלב 1: מעלים תמונה ל-Cloudinary
      const imageUrl = await uploadImageToCloudinary(imageFile);

      // שלב 2: שומרים את כל הנתונים בפיירבייס
      await setDoc(doc(db, 'users', uid), {
        uid,
        email: auth.currentUser.email,
        fullName: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
        birthDate: formData.birthDate,
        country: formData.country,
        state: formData.state || '',
        city: formData.city,
        about: formData.about,
        interests: formData.interests,
        profileImage: imageUrl,
        learningGoal: formData.learningGoal, // נשמר לשימוש עתידי
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
        <select name="country" value={formData.country} onChange={handleChange} required>
          <option value="">Select your country</option>
          <option value="USA">United States</option>
          <option value="Israel">Israel</option>
        </select>
        <p className="small-note">This helps us connect you with people from the other region</p>

        {formData.country === 'USA' && (
          <>
            <input type="text" name="state" placeholder="State*" value={formData.state} onChange={handleChange} required />
            <input type="text" name="city" placeholder="City*" value={formData.city} onChange={handleChange} required />
          </>
        )}

        {formData.country === 'Israel' && (
          <input type="text" name="city" placeholder="City*" value={formData.city} onChange={handleChange} required />
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

        {/* 💡 שדה להעלאת תמונה */}
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