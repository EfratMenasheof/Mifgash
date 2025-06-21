// utils/uploadToCloudinary.js
import axios from 'axios';

export async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'mifgash_upload');
  formData.append('cloud_name', 'dmbxpbx62');

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dmbxpbx62/image/upload',
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
}