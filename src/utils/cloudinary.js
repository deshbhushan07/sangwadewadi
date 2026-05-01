// src/utils/cloudinary.js
const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'sangwadewadi';

export const uploadToCloudinary = async (file, folder = 'sangwadewadi') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
};

export const getOptimizedUrl = (url, width = 800) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
};