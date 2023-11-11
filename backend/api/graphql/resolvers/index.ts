import userResolvers from './user.js'
import conversationResolvers from './conversation.js'
import messageResolvers from './message.js'
import scalarResolvers from './scalar.js'
import merge from 'lodash.merge'

const resolvers = merge(
  {}, 
  userResolvers, 
  conversationResolvers,
  messageResolvers,
  scalarResolvers
  );

export default resolvers;