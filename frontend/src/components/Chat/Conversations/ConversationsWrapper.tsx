import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useQuery } from '@apollo/client';
import ConversationsOperations from '../../../graphql/operations/conversations'
import { ConversationsData, ConversationPopulated, ConversationSubscriptionData } from '@/util/types';
import ConversationsList from './ConversationsList';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface ConversationsWrapperProps{
  session: Session
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({ 
  session 
}) => {

  const { 
    data: conversationsData, 
    loading: conversationsLoading, 
    error: conversationsError,
    subscribeToMore
  } = useQuery<ConversationsData>(ConversationsOperations.Queries.conversations)

  const router = useRouter()
  const { query: { conversationId } } = router

  const onViewConversation = async(conversationId: string) => {
    
    // 1. Push the conversationId to the router query params
    router.push({ query: { conversationId} })

    // 2. Mark the conversation as read
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