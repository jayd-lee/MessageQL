import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useQuery } from '@apollo/client';
import ConversationsOperations from '../../../graphql/operations/conversations'
import { ConversationsData, ConversationsPopulated } from '@/util/types';
import ConversationsList from './ConversationsList';
import { useEffect } from 'react';

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

  console.log('query data', conversationsData)

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationsOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev, 
        { subscriptionData }
        : { subscriptionData: { data: { conversationCreated: ConversationsPopulated } }}
        ) => {
          if (!subscriptionData?.data) return prev
          
          console.log('sub data', subscriptionData)

          const newConversation = subscriptionData.data.conversationCreated
          
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
  <Box width={{ base: '100%', md: '400px' }} bg='whiteAlpha.50' py={6} px={3}>
    {/* Skeleton Loader */}
    <ConversationsList session={session} conversations={conversationsData?.conversations || []} />
  </Box> 
  );
}
 
export default ConversationsWrapper;