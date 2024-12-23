// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchActivities } from '../../store/slices/activitySlice';

// const ActivityList = () => {
//   const dispatch = useDispatch();
//   const { activities, error } = useSelector((state) => state.activity);
//   const [isLoading, setIsLoading] = useState(true);
// console.log("activities",activities)
//   useEffect(() => {
//     const loadActivities = async () => {
//       try {
//         await dispatch(fetchActivities()).unwrap();
//       } catch (err) {
//         console.error('Failed to fetch activities:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadActivities();
//   }, [dispatch]);

//   if (isLoading) {
//     return <div className="p-4">Loading activities...</div>;
//   }

//   if (error) {
//     return <div className="p-4 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Activities</h1>
//       {activities.length === 0 ? (
//         <p>No activities found.</p>
//       ) : (
//         <ul className="space-y-4">
//           {activities.map((activity) => (
//             <li key={activity.id} className="border p-4 rounded-lg shadow-sm">
//               <h2 className="text-xl font-bold mb-2">{activity.title}</h2>
//               <p className="text-gray-600">{activity.description}</p>
//               <p className="text-gray-600">creator name : {activity.creator_name}</p>
//               <p className="text-gray-600">participants count : {activity.participant_count}</p>
//               {activity.images.map((image, index) => (
//                 <img
//                   key={index}
//                   src={`http://localhost:5000/uploads/images/${image}`}
//                   alt={`Activity ${activity.id} Image ${index + 1}`}
//                   className="mt-2"
//                 />
//               ))}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default ActivityList;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../../store/slices/activitySlice';
import axios from 'axios';
import ParticipantsList from './ParticipantsList';

const ActivityList = () => {
  const dispatch = useDispatch();
  const { activities, error } = useSelector((state) => state.activity);
  const [isLoading, setIsLoading] = useState(true);
  const [participantsVisible, setParticipantsVisible] = useState({});

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

  const handleParticipate = async (activityId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/activities/${activityId}/join`,
        {},
        { withCredentials: true }
      );
      if (response.data.alreadyJoined) {
        alert(response.data.message);  
      } else {
        alert(response.data.message);  
      }
    } catch (err) {
      console.error('Failed to participate:', err);
      alert(err.response?.data?.message || 'Failed to participate in the activity');
    }
  };

  const toggleParticipants = (activityId) => {
    setParticipantsVisible((prev) => ({
      ...prev,
      [activityId]: !prev[activityId],
    }));
  };

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
              <p className="text-gray-600">Creator Name: {activity.creator_name}</p>
              <p className="text-gray-600">Participants Count: {activity.participant_count}</p>
              {activity.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/uploads/images/${image}`}
                  alt={`Activity ${activity.id} Image ${index + 1}`}
                  className="mt-2"
                />
              ))}
              <div className="mt-4">
                <button
                  onClick={() => handleParticipate(activity.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Participate
                </button>
                <button
                  onClick={() => toggleParticipants(activity.id)}
                  className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  {participantsVisible[activity.id] ? 'Hide Participants' : 'Show Participants'}
                </button>
                {participantsVisible[activity.id] && (
                  <ParticipantsList activityId={activity.id} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityList;
