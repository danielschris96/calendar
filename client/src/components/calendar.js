import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal'; 

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root'); 

const MyCalendar = ({ currentGroup }) => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState(null); 
  const [eventName, setEventName] = useState(''); 
  const [eventCategory, setEventCategory] = useState(''); 

  useEffect(() => {
    const fetchData = async () => {
      await fetchEventsForGroup(currentGroup);
    };
    
    fetchData();
  }, [currentGroup]);

  const fetchEventsForGroup = async (groupId) => {
    const response = await fetch("http://localhost:3001/graphql", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetGroupEvents {
            group(id: "${groupId}") {
              events {
                _id
                name
                category
                startTime
                endTime
              }
            }
          }
        `,
      }),
    });
  
    const { data } = await response.json();
    const groupEvents = data.group.events;
  
    const events = groupEvents.map(event => ({
      ...event,
      start: new Date(event.startTime),
      end: new Date(event.endTime),
    }));
  
    setEvents(events);
  };

  const createEvent = async (name, category) => {
    const response = await fetch("http://localhost:3001/graphql", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation CreateEvent($name: String!, $category: String!, $startTime: String!, $endTime: String!) {
            createEvent(name: $name, category: $category, startTime: $startTime, endTime: $endTime) {
              _id
              name
              category
              startTime
              endTime
            }
          }
        `,
        variables: {
          name,
          category,
          startTime: newEvent.start,
          endTime: newEvent.end,
        },
      }),
    });
  
    const { data } = await response.json();
    const event = data.createEvent;
  
    const createdEvent = { 
      ...event,
      start: new Date(event.startTime),
      end: new Date(event.endTime),
    };
  
    setEvents([...events, createdEvent]);
    setNewEvent(null);
  };

  const handleCreateEvent = (event) => {
    event.preventDefault();
    createEvent(eventName, eventCategory);
    setEventName(''); 
    setEventCategory(''); 
  };

  return (
    <div>
      <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={({ start, end }) => setNewEvent({ start, end })}
          style={{ height: '80vh' }}
      />
      <Modal isOpen={newEvent !== null}>
        <h2>Create Event</h2>
        <form onSubmit={handleCreateEvent}>
          <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Event Name" required />
          <input type="text" value={eventCategory} onChange={e => setEventCategory(e.target.value)} placeholder="Category" required />
          <button type="submit">Create Event</button>
        </form>
      </Modal>
    </div>
  );
};

export default MyCalendar;