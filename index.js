require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
const { expressMiddleware } = require('@as-integrations/express5');
const cors = require('cors');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

async function startServer() {
  const app = express();

  // Create Apollo Server instance
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Habilitar instrospeccion siempre (incluso en producción para Render)
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(server)
  );

  app.get('/', (req, res) => {
    res.send('Server is running. Go to /graphql for the Apollo Sandbox.');
  });

  const PORT = process.env.PORT || 4000;
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI environment variable is not defined.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`✅ Connected to MongoDB Atlas (${mongoose.connection.name})`);
    
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
  }
}

startServer();
