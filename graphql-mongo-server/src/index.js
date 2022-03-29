import { ApolloServer, gql } from "apollo-server-express";
import { typeDefs } from "./typedefs";
import { resolvers } from "./resolvers";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const main = async () => {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  server.applyMiddleware({ app });

  await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.m2ma1.mongodb.net/gql-mongo-test?retryWrites=true&w=majority`,
    {}
  );

  app.listen({ port: 4000 }, () =>
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

main();
