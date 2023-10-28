import { Box } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationList from './ConversationList';
import { useQuery } from '@apollo/client';
import ConversationsOperations from '../../../graphql/operations/conversations'
import { ConversationsData } from '@/util/types';

interface ConversationsWrapperProps{
  session: Session
}

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({ 
  session 
}) => {

  const { 
    data: conversationsData, 
    loading: conversationsLoading, 
    error: conversationsError
  } = useQuery<ConversationsData>(ConversationsOperations.Queries.conversations)

  console.log('conversations data', conversationsData)

  return ( 
  <Box width={{ base: '100%', md: '400px' }} bg='whiteAlpha.50' py={6} px={3}>
    {/* Skeleton Loader */}
    <ConversationList session={session} />
  </Box> 
  );
}
 
export default ConversationsWrapper;