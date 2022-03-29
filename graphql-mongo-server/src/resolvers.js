import { Cat } from "./models/Cat";

export const resolvers = {
  Query: {
    hello: () => "Hello world!",
    cats: async () => await Cat.find()
  },
  Mutation: {
    createCat: (_, { name }) => {
      const kitty = new Cat({ name: name });
      kitty.save();
      console.log(kitty);
      return kitty;
    },
  },
};
