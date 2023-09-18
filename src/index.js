import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import typeDefs from './data/schema';
import resolvers from './resolvers/resolvers';
import connectToDB from './db/db';
import { makeExecutableSchema } from 'graphql-tools';

const app = express();
const PORT = 8000;
app.use(cors());

const db = connectToDB();

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});