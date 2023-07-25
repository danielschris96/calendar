import React from 'react';

const EventDetails = ({ event, clearSelectedEvent, handleEditEvent, handleDeleteEvent, setEditModalOpen }) => {
  return (
    <div>
      <h3>{event ? event.title : ''}</h3>
      <p>{event ? event.category : ''}</p>
      <p>{event ? new Date(event.start).toLocaleString() : ''}</p>
      <p>{event ? new Date(event.end).toLocaleString() : ''}</p>
      <button 
        onClick={() => {
          handleEditEvent();
          setEditModalOpen(true);
        }}
      >
        Edit
      </button>
      <button onClick={handleDeleteEvent}>Delete</button>
      <button onClick={clearSelectedEvent}>Close</button>
    </div>
  );
};

export default EventDetails;