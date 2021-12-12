const { buildSchema } = require("graphql");

module.exports = buildSchema(`
        type Event {
          _id: ID!
          name: String!
          description: String!
          price: Float!
          date: String!
          creator: User!
        }

        type User {
          _id: ID!
          email: String!
          password: String
          createdEvents: [Event!]
        }

        input EventInput {
          name: String!
          description: String!
          price: Float!
          date: String!
        }

        input UserInput {
          email: String!
          password: String!
        }

        type rootQuery {
            events: [Event!]!
        }

        type rootMutations {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: rootQuery
            mutation: rootMutations
        }
    `);
