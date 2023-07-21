import React from 'react';

const EventDetails = ({ event, clearSelectedEvent, editEvent, deleteEvent }) => {
  return event && (
    <div>
      <h2>{event.name}</h2>
      <p>{event.category}</p>
      <p>Starts: {event.start.toString()}</p>
      <p>Ends: {event.end.toString()}</p>
      <button onClick={clearSelectedEvent}>Close</button>
      <button onClick={() => editEvent(event)}>Edit</button>
      <button onClick={() => deleteEvent(event._id)}>Delete</button>
    </div>
  );
};

export default EventDetails;