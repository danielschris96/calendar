import React, { useState } from 'react';

const InfoPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    alerts: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckChange = () => {
    setFormData({
      ...formData,
      alerts: !formData.alerts,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Update user info API call here
  };

  return (
    <div>
      <h2>Update your information</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Alerts:
          <input
            type="checkbox"
            name="alerts"
            checked={formData.alerts}
            onChange={handleCheckChange}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default InfoPage;