const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const cors = require('cors');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schema');

// import database connection
const db = require('./config/connection');

// import middleware for authentication
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const startServer = async () => {
  await server.start();

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Apply Apollo GraphQL middleware after setting up express middleware
  server.applyMiddleware({ app });

  // Serve up static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // **Put this wildcard route handler last, after your middleware and routes.**
  // Send every other request to the React app. Define any API routes before this runs.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  db.on('connected', () => {
    app.listen(PORT, () => {
      console.log(`🌍 ==> API server now on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startServer();