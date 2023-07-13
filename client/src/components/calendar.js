import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const MyCalendar = ({ currentGroup }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        await fetchEventsForGroup(currentGroup);
      };
      
      fetchData();
    }, [currentGroup]);

    const fetchEventsForGroup = async (groupId) => {
      const response = await fetch("/graphql", {
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
    
      // convert start and end times to Date objects
      const events = groupEvents.map(event => ({
        ...event,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
      }));
    
      setEvents(events);
    };

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
            />
        </div>
    );
};

export default MyCalendar;