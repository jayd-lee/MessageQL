import { GraphQLError } from 'graphql'
import { GraphQLContext, MessagePopulated, MessageSentSubscriptionPayload, SendMessageArguments } from '../../util/types'
import { Prisma } from '@prisma/client'
import { withFilter } from 'graphql-subscriptions'
import { userIsConversationParticipant } from '../../util/functions'
import { conversationPopulated } from './conversation'


const resolvers = {
  Query: {
    messages: async(
      _: any, args: { conversationId: string }, context: GraphQLContext
    ): Promise<Array<MessagePopulated>> => {
      
      const { session, prisma } = context
      const { conversationId } = args

      if (!session) throw new GraphQLError('Not Authorized')

      const { user: {id: userId} } = session


      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId
        },
        include: conversationPopulated
      })

      if (!conversation) throw new GraphQLError('Conversation Not Found')

      // Verify that user is a participant
      const allowedToView = 
      userIsConversationParticipant(conversation.participants, userId)

      if (!allowedToView) throw new GraphQLError('Not Authorized')
      
      try {
        const messages = await prisma.message.findMany({
          where: {
            conversationId
          },
          include : messagePopulated,
          orderBy: {
            createdAt: 'desc'
          }
        })

        return messages;

      } catch(error: any) {
        console.log('message error', error)
        throw new GraphQLError(error?.message)
      }
    }
  },
  Mutation: {
    sendMessage: async(
      _: any, args: SendMessageArguments, context: GraphQLContext
    ): Promise<boolean> => {

      const {session, prisma, pubsub } = context

      if (!session) throw new GraphQLError('Not Authorized')
      
      const { user: { id: userId } } = session
      const { id: messageId, senderId, conversationId, body } = args
      
      if (userId !== senderId) throw new GraphQLError('Not Authorized')

      try {
        // Create new message entity
        const newMessage = await prisma.message.create({
          data: {
            id: messageId,
            senderId,
            conversationId,
            body
          },
          include: messagePopulated
        })

        // Update conversation entity
        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId
          },
          data: {
            latestMessageId: newMessage.id,
            participants: {
              update: {
                where: {
                  id: senderId
                },
                data: {
                  hasSeenLatestMessage: true
                }
              },
              updateMany: {
                where: {
                  NOT: {
                    userId: senderId
                  }
                },
                data: {
                  hasSeenLatestMessage: false
                }
              }
            }
          }
        })

        pubsub.publish('MESSAGE_SENT', { messageSent: newMessage })
        // pubsub.publish('CONVERSATION_UPDATED', {conversationUpdated: { conversation }})
      
      } catch(error: any) {
        console.log('sendMessage error', error)
        throw new GraphQLError('Error sending message')
      }

      return true
    }
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter((
          _: any, __: any, context: GraphQLContext
        ) => {
          const { pubsub } = context
          return pubsub.asyncIterator(['MESSAGE_SENT'])

        }, (
          payload: MessageSentSubscriptionPayload, 
          args: { conversationId: string }, 
          context: GraphQLContext
        ) => {
          return payload.messageSent.conversationId === args.conversationId
        }
        )
    }

  }
}

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true
    }
  }
})

export default resolvers