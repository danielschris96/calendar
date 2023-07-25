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
    }
  }, [groupData]);

  const handleGroupChange = (event) => {
    const groupId = event.target.value;
    setSelectedGroup(groupId);
    getGroupEvents({ variables: { groupId } });
  };

  useEffect(() => {
    if (eventData && eventData.group && eventData.group.events) {
      const events = eventData.group.events.map(event => ({
        ...event,
        _id: event._id, // this is needed as your backend might be using _id as key
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
  };

  const handleEditEvent = async () => {
    const { data } = await updateEventMutation({
      variables: {
        id: selectedEvent._id,
        name: eventName,
        category: eventCategory,
        startTime: selectedEvent.start.getTime().toString(),
        endTime: selectedEvent.end.getTime().toString(),
      },
    });
    const updatedEvent = {
      ...data.updateEvent,
      title: data.updateEvent.name,
      allDay: false,
      start: new Date(parseInt(data.updateEvent.startTime)),
      end: new Date(parseInt(data.updateEvent.endTime)),
    };
    setEvents(events.map(e => e._id === selectedEvent._id ? updatedEvent : e));
    setSelectedEvent(null);
    setEventName('');
    setEventCategory('');
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
        onSelectEvent={event => setSelectedEvent(event)} // Select the event when clicked
        style={{ height: '80vh' }}
      />
      <EventDetails
        event={selectedEvent}
        clearSelectedEvent={() => setSelectedEvent(null)}
        editEvent={handleEditEvent}
        deleteEvent={handleDeleteEvent}
      />
      <Modal isOpen={newEvent !== null}>
        <h2>Create Event</h2>
        <form onSubmit={handleCreateEvent}>
          <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} placeholder="Event Name" required />
          <input type="text" value={eventCategory} onChange={e => setEventCategory(e.target.value)} placeholder="Category" required />
          <button type="submit">Create Event</button>
        </form>
        <button onClick={() => setNewEvent(null)}>Cancel</button>
      </Modal>
    </div>
  );
};

export default MyCalendar;