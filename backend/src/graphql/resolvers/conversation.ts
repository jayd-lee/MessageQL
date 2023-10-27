import { GraphQLContext } from '../../util/types';


const resolvers = {
  Query: {
    
  },
  Mutation: {
    createConversation: async(
      _: any, args: { participantIds: Array<string> }, context: GraphQLContext
      ) => {
      console.log('CREATE CONVERSATION', args)
    }
  }
}

export default resolvers;