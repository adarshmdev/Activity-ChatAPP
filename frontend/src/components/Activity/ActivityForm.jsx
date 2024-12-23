import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createActivity } from '../../redux/activitySlice';

const ActivityForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length < 3) {
      alert('Please upload at least 3 images.');
      return;
    }

    const activityData = new FormData();
    activityData.append('title', formData.title);
    activityData.append('description', formData.description);
    images.forEach((image) => activityData.append('images', image));

    dispatch(createActivity(activityData));
    setFormData({ title: '', description: '' });
    setImages([]);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Create New Activity</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="block w-full mb-3 p-2 border"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="block w-full mb-3 p-2 border"
        ></textarea>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full mb-3 p-2 border"
        />
        <button className="bg-green-500 text-white px-4 py-2" type="submit">
          Create Activity
        </button>
      </form>
    </div>
  );
};

export default ActivityForm;
