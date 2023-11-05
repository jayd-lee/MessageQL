import userResolvers from './user'
import conversationResolvers from './conversation'
import messageResolvers from './message'
import scalarResolvers from './scalar'
import merge from 'lodash.merge'

const resolvers = merge(
  {}, 
  userResolvers, 
  conversationResolvers,
  messageResolvers,
  scalarResolvers
  );

export default resolvers;