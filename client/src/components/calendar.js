import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal'; 
import EventDetails from './EventDetails';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { GET_ALL_GROUPS, GET_GROUP_EVENTS } from '../utils/queries';
import { CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT } from '../utils/mutations';

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root'); 

const MyCalendar = () => {
  const { data: groupData } = useQuery(GET_ALL_GROUPS);
  const [getGroupEvents, { data: eventData }] = useLazyQuery(GET_GROUP_EVENTS);
  const [createEventMutation] = useMutation(CREATE_EVENT);
  const [updateEventMutation] = useMutation(UPDATE_EVENT);
  const [deleteEventMutation] = useMutation(DELETE_EVENT);

  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState(null);
  const [eventName, setEventName] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (groupData && groupData.groups) {
      setGroups(groupData.groups);
      const lastSelectedGroup = localStorage.getItem('lastSelectedGroup');
      if (lastSelectedGroup) {
        setSelectedGroup(lastSelectedGroup);
        getGroupEvents({ variables: { groupId: lastSelectedGroup } });
      }
    }
  }, [groupData, getGroupEvents]);

  const handleGroupChange = (event) => {
    const groupId = event.target.value;
    setSelectedGroup(groupId);
    getGroupEvents({ variables: { groupId } });
  
    // Save to localStorage
    localStorage.setItem('lastSelectedGroup', groupId);
  };

  useEffect(() => {
    if (eventData && eventData.group && eventData.group.events) {
      const events = eventData.group.events.map(event => ({
        ...event,
        _id: event._id,
        title: event.name,
        allDay: false,
        start: new Date(parseInt(event.startTime)),
        end: new Date(parseInt(event.endTime)),
      }));
      setEvents(events);
    }
  }, [eventData]);

  const handleCreateEvent = async (event) => {
    event.preventDefault();
    const { data } = await createEventMutation({
      variables: {
        name: eventName,
        category: eventCategory,
        groupId: selectedGroup,
        startTime: newEvent.start.getTime().toString(),
        endTime: newEvent.end.getTime().toString(),
      },
    });
    const createdEvent = {
      ...data.createEvent,
      title: data.createEvent.name,
      allDay: false,
      start: new Date(parseInt(data.createEvent.startTime)),
      end: new Date(parseInt(data.createEvent.endTime)),
    };
    setEvents([...events, createdEvent]);
    setNewEvent(null);
    setEventName('');
    setEventCategory('');
    setEditModalOpen(false); // Close the create event modal after submission
  };

  const handleEditEvent = (event) => {
    setEditEvent(event);
    setEventName(event.title);
    setEventCategory(event.category);
    setNewEvent({
      start: new Date(event.start),
      end: new Date(event.end)
    });
    setEditModalOpen(true);
  };

  const handleEditEventSubmit = async (event) => {
    event.preventDefault();
    const { data } = await updateEventMutation({
      variables: {
        id: editEvent._id,
        name: eventName,
        category: eventCategory,
        startTime: newEvent.start.getTime().toString(),
        endTime: newEvent.end.getTime().toString(),
      },
    });
    const updatedEvent = {
      ...data.updateEvent,
      title: data.updateEvent.name,
      allDay: false,
      start: new Date(parseInt(data.updateEvent.startTime)),
      end: new Date(parseInt(data.updateEvent.endTime)),
    };
    setEvents(events.map(e => e._id === editEvent._id ? updatedEvent : e));
    setSelectedEvent(null);
    setEventName('');
    setEventCategory('');
    setNewEvent(null);
    setEditModalOpen(false);
  };

  const handleDeleteEvent = async () => {
    await deleteEventMutation({
      variables: {
        id: selectedEvent._id,
      },
    });
    setEvents(events.filter(e => e._id !== selectedEvent._id));
    setSelectedEvent(null);
    setEditModalOpen(false);
  };

  return (
    <div>
      <select onChange={handleGroupChange}>
        <option value="">Select a group</option>
        {groups.map(group => (
          <option key={group._id} value={group._id}>
            {group.name}
          </option>
        ))}
      </select>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="name"
        selectable
        onSelectSlot={({ start, end }) => setNewEvent({ start, end })}
        onSelectEvent={event => setSelectedEvent(event)}
        style={{ height: '80vh' }}
      />
      <EventDetails
        event={selectedEvent}
        clearSelectedEvent={() => setSelectedEvent(null)}
        handleEditEvent={handleEditEvent}
        handleDeleteEvent={handleDeleteEvent}
      />
      <Modal isOpen={newEvent !== null} onRequestClose={() => setNewEvent(null)}>
        <h2>Create Event</h2>
        <form onSubmit={handleCreateEvent}>
          <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Event Name" required />
          <input type="text" value={eventCategory} onChange={e => setEventCategory(e.target.value)} placeholder="Category" required />
          <div>
            <label>Start Date:</label>
            <input
              type="datetime-local"
              value={newEvent?.start?.toISOString().slice(0, 16) || ''}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, start: new Date(e.target.value) }))
              }
              required
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="datetime-local"
              value={newEvent?.end?.toISOString().slice(0, 16) || ''}
              onChange={(e) =>
                setNewEvent((prev) => ({ ...prev, end: new Date(e.target.value) }))
              }
              required
            />
          </div>
          <button type="submit">Create Event</button>
          <button onClick={() => setNewEvent(null)}>Cancel</button>
        </form>
      </Modal>
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onRequestClose={() => setEditModalOpen(false)}>
          <h2>Edit Event</h2>
          <form onSubmit={handleEditEventSubmit}>
            <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Event Name" required />
            <input type="text" value={eventCategory} onChange={e => setEventCategory(e.target.value)} placeholder="Category" required />
            <div>
              <label>Start Date:</label>
              <input
                type="datetime-local"
                value={newEvent?.start?.toISOString().slice(0, 16) || ''}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, start: new Date(e.target.value) }))
                }
                required
              />
            </div>
            <div>
              <label>End Date:</label>
              <input
                type="datetime-local"
                value={newEvent?.end?.toISOString().slice(0, 16) || ''}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, end: new Date(e.target.value) }))
                }
                required
              />
            </div>
            <button type="submit">Update Event</button>
            <button onClick={() => setEditModalOpen(false)}>Cancel</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MyCalendar;