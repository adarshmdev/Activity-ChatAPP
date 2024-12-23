import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../../store/slices/activitySlice';

const ActivityList = () => {
  const dispatch = useDispatch();
  const { activities, error } = useSelector((state) => state.activity);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        await dispatch(fetchActivities()).unwrap();
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, [dispatch]);

  if (isLoading) {
    return <div className="p-4">Loading activities...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Activities</h1>
      {activities.length === 0 ? (
        <p>No activities found.</p>
      ) : (
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-2">{activity.title}</h2>
              <p className="text-gray-600">{activity.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityList;