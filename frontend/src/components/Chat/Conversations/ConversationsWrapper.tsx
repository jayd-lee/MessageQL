import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import ConversationsOperations from '../../../graphql/operations/conversations'
import { ConversationsData, ConversationSubscriptionData, MarkConversationAsReadInput, ParticipantPopulated, ConversationUpdatedData } from '@/util/types';
import ConversationsList from './ConversationsList';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface ConversationsWrapperProps{
  session: Session
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({ 
  session 
}) => {
  const router = useRouter()
  const { query: { conversationId } } = router
  const { user: { id: userId} } = session

  const { 
    data: conversationsData, 
    loading: conversationsLoading, 
    error: conversationsError,
    subscribeToMore
  } = useQuery<ConversationsData>(ConversationsOperations.Queries.conversations)

  const [markConversationAsRead] = useMutation<
  { markConversationAsRead: boolean}, MarkConversationAsReadInput
  >(ConversationsOperations.Mutations.markConversationAsRead)

  useSubscription<ConversationUpdatedData>(
    ConversationsOperations.Subscriptions.conversationUpdated,
    {
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        console.log('firing')

        if (!subscriptionData) return;

      },
    }
  );

  const onViewConversation = async(conversationId: string, hasSeenLatestMessage: boolean | undefined) => {
    
    // 1. Push the conversationId to the router query params
    router.push({ query: { conversationId} })

    // 2. Mark the conversation as read

    if (hasSeenLatestMessage) return

    try {
      await markConversationAsRead({
        variables: {
          userId, 
          conversationId
        },
        optimisticResponse: {
          markConversationAsRead: true
        },
        update: (cache) => {
          const participantsFragment = cache.readFragment<{ participants: Array<ParticipantPopulated> }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    username
                  }
                  hasSeenLatestMessage
                }
              }
            `
          })
          
          if (!participantsFragment) return

          const participants = [...participantsFragment.participants]

          const userParticipantIndex = participants.findIndex((p) => p.user.id === userId)

          if (userParticipantIndex === -1) return

          const userParticipant = participants[userParticipantIndex];

          // update participant to show latest message as read
          participants[userParticipantIndex] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          }

          // update cache
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdateParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants
            }
          })


        }
      })

    } catch(error: any) {
      console.log('onViewConversation error', error)
    }


  }

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationsOperations.Subscriptions.conversationCreated,
      updateQuery: (prev, { subscriptionData } : ConversationSubscriptionData) => {
          if (!subscriptionData?.data) return prev
          
          const { data: { conversationCreated: newConversation } } = subscriptionData
          
          return Object.assign({}, prev, {
            conversations: [newConversation ,...prev.conversations]
          })
      }
    })
  }

  //execute subscription on mount
  useEffect(()=> {
    subscribeToNewConversations()
  }, [])


  return ( 
  <Box 
    display={{ base: conversationId ? 'none' : 'flex', md: 'flex' }}
    width={{ base: '100%', md: '400px' }}
    bg='whiteAlpha.50' 
    py={6} 
    px={3}
  >
  
    <ConversationsList 
      session={session} 
      conversations={conversationsData?.conversations || []}
      onViewConversation={onViewConversation}
      conversationLoading={conversationsLoading}
    />
   
  </Box> 
  );
}
 
export default ConversationsWrapper;