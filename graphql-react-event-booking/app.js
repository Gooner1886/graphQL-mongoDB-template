const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");

const app = express();

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
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc };
            });
          })
          .catch((err) => {
            console.log(err);
          });
      },
      createEvent: (args) => {
        const event = new Event({
          name: args.eventInput.name,
          description: args.eventInput.description,
          price: args.eventInput.price,
          date: new Date(args.eventInput.date),
        });
        return event
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
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
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ix0ke.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server listening on port 3000...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
