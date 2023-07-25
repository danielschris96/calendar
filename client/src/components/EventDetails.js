import React from 'react';

const EventDetails = ({ event, clearSelectedEvent, handleEditEvent, handleDeleteEvent }) => {
  if (!event) {
    return null;
  }

  return (
    <div>
      <h3>{event.title}</h3>
      <p>{event.category}</p>
      <p>{new Date(event.start).toLocaleString()}</p>
      <p>{new Date(event.end).toLocaleString()}</p>
      <button onClick={() => handleEditEvent(event)}>Edit</button>
      <button onClick={handleDeleteEvent}>Delete</button>
      <button onClick={clearSelectedEvent}>Close</button>
    </div>
  );
};

export default EventDetails;