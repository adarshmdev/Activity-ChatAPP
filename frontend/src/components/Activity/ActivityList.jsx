import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../../redux/activitySlice';

const ActivityList = () => {
  const dispatch = useDispatch();
  const { activities } = useSelector((state) => state.activity);

  useEffect(() => {
    dispatch(fetchActivities());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Activities</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id} className="border p-2 mb-2">
            <h2 className="font-bold">{activity.title}</h2>
            <p>{activity.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityList;
