import { CreateUsernameResponse, GraphQLContext } from '../../util/types';


const resolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    createUsername: async (
      _: any, 
      args : {username: string}, 
      context : GraphQLContext): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = context;
      
      if (!session?.user) {
        return {
          error: 'Not authorized',
        }
      }

      const { id } = session.user;

      try {
        /**
         * Check that username is not taken
         */
        const existingUser = await prisma.user.findUnique({
          where: {
            username
          }
        })

        if (existingUser) return { error: 'Username already taken' }

        await prisma.user.update({ 
          where: { id },     // id: id
          data: { username } // username: username
        })

        return {success: true}

      } catch(error: any) {
          console.log('createUsername error', error)
          return {
            error: error?.message
          }
      }
      

    },
  },
}

export default resolvers;