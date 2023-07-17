import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // replace Switch with Routes
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header';
import Footer from './components/footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GroupsPage from './pages/GroupsPage';
import InfoPage from './pages/InfoPage';

import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Create an HTTP link to the GraphQL server
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
});

// Create an auth link to include the authentication token in the headers
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create an Apollo Client instance with the auth link and the in-memory cache
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Header />
          <Routes> {/* replace Switch with Routes */}
            <Route path="/" element={<HomePage />} /> {/* Replace component={HomePage} with element={<HomePage />} */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/info" element={<InfoPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;