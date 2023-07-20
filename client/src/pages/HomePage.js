import React from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Don't forget to import the calendar CSS
import Calendar from '../components/calendar';

const HomePage = () => {
  return (
    <div>
      <Calendar />
    </div>
  );
};

export default HomePage;