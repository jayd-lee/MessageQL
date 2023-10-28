import { Box, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import ConversationModal from './Modal/Modal'
import { useState } from 'react';
import { ConversationsPopulated } from '../../../util/types'
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  session: Session
  conversations: Array<ConversationsPopulated>
}

const ConversationsList: React.FC<ConversationListProps> = ({ session, conversations }) => {
  
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)
  
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
    {conversations.map((conversation) => (
        <ConversationItem key={conversation.id} conversation={conversation} />
    ))}
  </Box>
  );
}
 
export default ConversationsList;