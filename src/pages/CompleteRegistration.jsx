import { useState } from 'react';
import './CompleteRegistration.css';
import useUploadImage from '../hooks/useUploadImage';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import InterestSelector from '../components/InterestSelector';
import { useNavigate } from "react-router-dom";

function CompleteRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    birthDate: '',
    city: '',
    state: '',
    country: '',
    about: '',
    interests: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const uploadImage = useUploadImage();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error('User not authenticated');

      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage(uid, imageFile);
      }

      await setDoc(doc(db, 'users', uid), {
        ...formData,
        profileImage: imageUrl,
      });

      alert('Registration complete!');
      navigate("/home"); // 👈 ניווט אחרי סיום
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
    setUploading(false);
  };

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2>Complete Your Registration</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name*"
          required
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="middleName"
          placeholder="Middle Name (optional)"
          value={formData.middleName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name*"
          required
          value={formData.lastName}
          onChange={handleChange}
        />
        <label>Birth Date*</label>
        <input
          type="date"
          name="birthDate"
          required
          value={formData.birthDate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State (if applicable)"
          value={formData.state}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
        />
        <textarea
          name="about"
          placeholder="Tell us a bit about yourself"
          value={formData.about}
          onChange={handleChange}
        />
        <InterestSelector
          selectedInterests={formData.interests}
          setSelectedInterests={(interests) =>
            setFormData((prev) => ({ ...prev, interests }))
          }
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <button type="submit" className="submit-btn" disabled={uploading}>
          {uploading ? 'Submitting...' : 'Finish Registration'}
        </button>
      </form>
    </div>
  );
}

export default CompleteRegistration;