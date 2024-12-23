import React, { useEffect, useState } from 'react';
import API from '../../api';

const ParticipantsList = ({ activityId }) => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { data } = await API.get(`/activities/${activityId}/participants`);
        setParticipants(data);
      } catch (error) {
        console.error('Failed to fetch participants', error);
      }
    };

    fetchParticipants();
  }, [activityId]);

  return (
    <div className="p-4">
      <h2 className="text-lg mb-4">Participants</h2>
      <ul>
        {participants.map((participant) => (
          <li key={participant.id} className="border p-2 mb-2">
            {participant.name} ({participant.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantsList;
