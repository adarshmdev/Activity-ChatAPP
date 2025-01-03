
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createActivity } from '../../store/slices/activitySlice';

const ActivityForm = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.activity);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    setImages(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    if (images.length === 0) {
      alert('Please upload at least one image.');
      return;
    }

    if (images.length > 3) {
      alert('Maximum 3 images allowed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const activityData = new FormData();
      activityData.append('title', formData.title.trim());
      activityData.append('description', formData.description.trim());
      
      // Append each image separately
      images.forEach((image) => {
        activityData.append('images', image);
      });

      const result = await dispatch(createActivity(activityData)).unwrap();
      
      if (result) {
        setFormData({ title: '', description: '' });
        setImages([]);
        alert('Activity created successfully!');
      }
    } catch (err) {
      console.error('Failed to create activity:', err);
      alert(err.message || 'Failed to create activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create New Activity</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="block w-full mb-3 p-2 border rounded focus:outline-none focus:border-blue-500"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="block w-full mb-3 p-2 border rounded focus:outline-none focus:border-blue-500 min-h-[100px]"
          required
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full mb-3 p-2 border rounded"
        />
        <div className="mb-3">
          {images.length > 0 && (
            <span className="text-sm text-gray-600">
              {images.length} image{images.length !== 1 ? 's' : ''} selected 
              (Max 3 images allowed)
            </span>
          )}
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Activity'}
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;