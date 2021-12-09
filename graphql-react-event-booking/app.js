const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

app.use(bodyParser.json());

// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema: buildSchema(`
//         type rootQuery {
//             events: [String!]!
//         }

//         type rootMutations {
//             createEvent(name: String): String
//         }

//         schema {
//             query: rootQuery
//             mutation: rootMutations
//         }
//     `),
//     rootValue: {
//       events: () => {
//         return ["All Night Coding", "Premier League watchalong", "Sailing"];
//       },
//       createEvent: (args) => {
//         const eventName = args.name;
//         return eventName;
//       },
//     },
//     graphiql: true,
//   })
// );

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type rootQuery {
            posts: [String!]!
        }

        type rootMutation {
            createPosts(postName: String): String 
        }

        schema {
            query: rootQuery
            mutation: rootMutation
        }
    `),
    rootValue: {
      posts: () => {
        return [
          "My first post",
          "Arsenal will win the CL in 2024",
          "I believe in JavaScript supremacy",
        ];
      },
      createPosts: (args) => {
        const name = args.postName;
        return name;
      },
    },
    graphiql: true,
  })
);

app.listen(3000);
