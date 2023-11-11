import { GraphQLError } from 'graphql';
import { ConversationCreatedSubscriptionPayload, ConversationPopulated, ConversationUpdatedSubscriptionPayload, GraphQLContext } from '../../util/types';
import { Prisma } from '@prisma/client';
import { withFilter } from 'graphql-subscriptions';
import { userIsConversationParticipant } from '../../util/functions';


const resolvers = {
  Query: {
    conversations: async(
      _: any, __: any, context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { session, prisma} = context

      if (!session?.user) throw new GraphQLError('Not Authorized')

      const { user: { id: userId } } = session

      try {
        const conversations = await prisma.conversation.findMany({
          where : {
            participants: {
              some: {
                userId: {
                  equals: userId
                }
              }
            }
          },
          include: conversationPopulated
        })

        return conversations
      } catch(error: any) {
        console.log('conversations error', error)
        throw new GraphQLError(error?.message)
      }

    }
  },
  Mutation: {
    createConversation: async(
      _: any, args: { participantIds: Array<string> }, context: GraphQLContext
      ): Promise<{ conversationId: string }> => {
        const { session, prisma, pubsub  } = context
        const { participantIds } = args

        if (!session?.user) throw new GraphQLError('Not Authorized')

        const { user: { id: userId } } = session

        try {
          const conversation = await prisma.conversation.create({ 
            data : {
              participants: {
                createMany: {
                  data: participantIds.map(id => ({
                    userId: id,
                    hasSeenLatestMessage: id === userId
                  }))
                }
              }
            },
            include: conversationPopulated
          })

          // emit a conversation_created event using pubsub
          pubsub.publish('CONVERSATION_CREATED', {
            conversationCreated: conversation
          })

          return  {
            conversationId: conversation.id
          }
          
        } catch(error: any) {
          console.log('createConversation Error', error)
          throw new GraphQLError('Error creating conversation')
        }

      },
      markConversationAsRead: async(
        _: any, 
        args: { userId: string, conversationId: string}, 
        context: GraphQLContext
        ) => {
          const {session, prisma} = context
          const {userId, conversationId} = args
  
          if (!session?.user) throw new GraphQLError('Not Authorized')
  
          try {
  
            const participant = await prisma.conversationParticipant.findFirst({
              where: {
                userId,
                conversationId
              }
            })
  
            if (!participant) throw new GraphQLError('Participant entity not found')
  
            await prisma.conversationParticipant.update({
              where: {
                id: participant.id
              },
              data: {
                hasSeenLatestMessage: true
              }
            })
            return true
          } catch(error: any) {
            console.log('markConversationAsRead error', error)
            throw new GraphQLError(error.message)
          }
  
      }
  },

  Subscription: {
    conversationCreated: {
      // subscribe: (_: any, __: any, context: GraphQLContext) => {
      //   const { pubsub } = context
      //   return pubsub.asyncIterator(['CONVERSATION_CREATED'])
      // }
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context
          return pubsub.asyncIterator(['CONVERSATION_CREATED']) },
        
        (payload: ConversationCreatedSubscriptionPayload, _, context: GraphQLContext) => {
          const { session } = context
          const { conversationCreated : { participants }} = payload
          
          if (!session?.user) throw new GraphQLError('Not Authorized')
          // const userIsParticipant = !!participants.find(
          //   (p) => p.userId === session?.user.id
          // )
          const { user: {id: userId} } =  session

          const userIsParticipant = userIsConversationParticipant(participants, userId)

          return userIsParticipant
        }
      )
    },
    conversationUpdate: {
      subscribe: withFilter( 
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context
          return pubsub.asyncIterator(['CONVERSATION_UPDATED'])
        }, 
        (payload: ConversationUpdatedSubscriptionPayload, _, context: GraphQLContext) => {
          
          const { session } = context
          if (!session?.user) throw new GraphQLError('Not Authorized')

          const {conversationUpdated: { conversation: { participants }}} = payload
          const { user: { id: userId }} =  session

          const userIsParticipant = userIsConversationParticipant(participants, userId)

          return userIsParticipant
      })
    }
  }
}

export const participantPopulated = Prisma.validator<Prisma.ConversationParticipantInclude>()({
  user: {
    select: {
      id: true,
      username: true
    }
  }
})
export const conversationPopulated = Prisma.validator<Prisma.ConversationInclude>()({
  participants : {
    include: participantPopulated
  },
  latestMessage: {
    include: {
      sender: {
        select: {
          id: true,
          username: true
        }
      }
    }
  }
})

export default resolvers;