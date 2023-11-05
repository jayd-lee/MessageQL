import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationModal from './Modal/Modal'
import { useState } from 'react';
import { ConversationPopulated } from '../../../util/types'
import ConversationItem from './ConversationItem';
import { useRouter } from 'next/router';
import SkeletonLoader from '@/components/common/SkeletonLoader';

interface ConversationListProps {
  session: Session
  conversations: Array<ConversationPopulated>
  onViewConversation: (conversationId: string) => void
  conversationLoading: boolean
}

const ConversationsList: React.FC<ConversationListProps> = ({ 
  session, conversations, onViewConversation, conversationLoading 
}) => {
  const { user: { id: userId } } = session
  const [isOpen, setIsOpen] = useState(false)
  
  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)
  
  const router = useRouter()

  return ( 
  <Box width='100%'>
    <Box 
    py={2} 
    px={4} 
    mb={4} 
    bg='blackAlpha.300' 
    borderRadius={4}
    cursor='pointer'
    onClick={onOpen}
    >
      <Text textAlign='center' color='whiteAlpha.800' fontWeight={500}>
        Find or start a conversation
      </Text>
      <ConversationModal isOpen={isOpen} onClose={onClose} session={session} />
    </Box>
    {
      conversationLoading? 
      <Box
        display='flex'
        flexDirection='column'
        gap={4}
      >
        <SkeletonLoader count={7} height='75px' />
      </Box>
      :
      conversations.map((conversation) => (
          <ConversationItem 
          key={conversation.id} 
          userId={userId}
          conversation={conversation} 
          onClick={() => onViewConversation(conversation.id)} 
          isSelected={conversation.id === router.query.conversationId}
          />
      ))
    
    }
  </Box>
  );
}
 
export default ConversationsList;