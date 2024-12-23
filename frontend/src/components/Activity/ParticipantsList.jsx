import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import API from '../../api';

const ParticipantsList = ({ activityId }) => {
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setIsLoading(true);
        const { data } = await API.get(`/activities/${activityId}/participants`);
        setParticipants(data);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch participants');
        console.error('Failed to fetch participants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (activityId) {
      fetchParticipants();
    }
  }, [activityId]);

  if (isLoading) {
    return <div className="p-4">Loading participants...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Participants</h2>
      {participants.length === 0 ? (
        <p>No participants yet.</p>
      ) : (
        <ul className="space-y-2">
          {participants.map((participant) => (
            <li key={participant.id} className="border p-3 rounded">
              <span className="font-medium">{participant.name}</span>
              <span className="text-gray-500 ml-2">({participant.email})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ParticipantsList.propTypes = {
  activityId: PropTypes.string.isRequired,
};

export default ParticipantsList;