import { GraphQLError } from 'graphql';
import { CreateUsernameResponse, GraphQLContext } from '../../util/types';
import { User } from '@prisma/client';


const resolvers = {
  Query: {
    searchUsers: async (
      _: any, args : {username: string}, context : GraphQLContext
      ): Promise<Array<User>> => {
      const { username: searchedUsername } = args
      const { session, prisma } = context

      if (!session?.user) {
        throw new GraphQLError('Not authorized')
      }

      const { 
        user: { username: myUsername } 
      } = session

      try {
        const users = await prisma.user.findMany({ 
          where: {
            username: {
              contains: searchedUsername,
              not: myUsername,
              mode: 'insensitive'
            }
          }
        })

        return users

      } catch(error: any) {
        console.log('searchUsers error', error)
        throw new GraphQLError(error?.message)
      }

    },
  },
  Mutation: {
    createUsername: async (
      _: any, args : {username: string}, context : GraphQLContext
      ): Promise<CreateUsernameResponse> => {
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
          return { error: error?.message }
      }

    },
  },
}

export default resolvers;