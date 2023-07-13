import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="content-container">
        <p>&copy; {new Date().getFullYear()} My Calendar App. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;