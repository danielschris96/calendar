import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';

import apolloClient from './apolloClient'; // Your Apollo Client setup

import Header from './components/header';
import Footer from './components/footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GroupsPage from './pages/GroupsPage';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/groups" component={GroupsPage} />
            {/* You can add more routes as needed */}
          </Switch>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;