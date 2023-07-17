import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import AuthService from '../utils/auth'; // replace with actual path to your auth.js file
import { useNavigate } from 'react-router-dom';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const SIGNUP = gql`
  mutation Signup($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

const LoginPage = () => {
  const navigate = useNavigate(); // call useNavigate hook inside the component

  const [isSignup, setIsSignup] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [login, { error: loginError }] = useMutation(LOGIN, {
    onCompleted: ({ login }) => {
      AuthService.login(login.token);
      navigate('/');
    },
  });

  const [signup, { error: signupError }] = useMutation(SIGNUP, {
    onCompleted: ({ signup }) => {
      AuthService.login(signup.token);
      navigate('/');
    },
  });

  const switchForm = () => {
    setIsSignup(!isSignup);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    login({ variables: { email: loginEmail, password: loginPassword } });
  };

  const handleSignup = (event) => {
    event.preventDefault();
    signup({ variables: { name: signupName, email: signupEmail, password: signupPassword } });
  };

  return (
    <div>
      {!isSignup ? (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Login</button>
          </form>
          <button onClick={switchForm}>Sign Up Instead</button>
        </div>
      ) : (
        <div>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignup}>
            <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="Name" />
            <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Sign Up</button>
          </form>
          <button onClick={switchForm}>Login Instead</button>
        </div>
      )}
      {loginError && <p>{loginError.message}</p>}
      {signupError && <p>{signupError.message}</p>}
    </div>
  );
};

export default LoginPage;