import React, { useState } from 'react';

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);

  const switchForm = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div>
      {!isSignup ? (
        <div>
          <h2>Login</h2>
          <form>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
          </form>
          <button onClick={switchForm}>Sign Up Instead</button>
        </div>
      ) : (
        <div>
          <h2>Sign Up</h2>
          <form>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign Up</button>
          </form>
          <button onClick={switchForm}>Login Instead</button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;