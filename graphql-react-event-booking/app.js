const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const app = express();

const events = [];

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
          _id: ID
          name: String!
          description: String!
          price: Float!
          date: String!
        }

        input EventInput {
          name: String!
          description: String!
          price: Float!
          date: String!
        }

        type rootQuery {
            events: [Event!]!
        }

        type rootMutations {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: rootQuery
            mutation: rootMutations
        }
    `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          name: args.eventInput.name,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
        };
        events.push(event);
        console.log(event);
        return event;
      },
    },
    graphiql: true,
  })
);

// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema: buildSchema(`

//         type rootQuery {
//             posts: [String!]!
//         }

//         type rootMutation {
//             createPosts(postName: String): String
//         }

//         schema {
//             query: rootQuery
//             mutation: rootMutation
//         }
//     `),
//     rootValue: {
//       posts: () => {
//         return [
//           "My first post",
//           "Arsenal will win the CL in 2024",
//           "I believe in JavaScript supremacy",
//         ];
//       },
//       createPosts: (args) => {
//         const name = args.postName;
//         return name;
//       },
//     },
//     graphiql: true,
//   })
// );

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ix0ke.mongodb.net/${process.env.MONGO_DBs}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server listening on port 3000...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
