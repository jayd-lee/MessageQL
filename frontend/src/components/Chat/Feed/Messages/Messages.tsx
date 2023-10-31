import { MessagesVariables, MessagesData } from '@/util/types';
import { useQuery } from '@apollo/client';
import { Flex, Stack } from '@chakra-ui/react';
import MessageOperations from '../../../../graphql/operations/message'
import { toast } from 'react-hot-toast';
import message from '../../../../graphql/operations/message';
import SkeletonLoader from '@/components/common/SkeletonLoader';

interface MessagesProps {
  userId: string
  conversationId: string
}

const Messages: React.FC<MessagesProps> = ({
  userId,
  conversationId
}) => {

  const { data, loading, error, subscribeToMore } = useQuery<MessagesData, MessagesVariables>(
    MessageOperations.Query.messages, 
    { variables: { conversationId }, 
    onError: ({ message }) => {
      toast.error(message)
    },
    }
  ) 
  if (error) return null

  console.log('messages data', data)

  return ( 
  <Flex direction='column' justify='flex-end' overflow='hidden'>
    {loading && (
      <Stack spacing={4} p={4}>
        <SkeletonLoader count={4} height='60px' />
        <span>Loading messages</span>
      </Stack> 
      )
    }
    {data?.messages && (
      <Flex direction='column-reverse' overflowY='scroll' height='100%'>
        {data.messages.map((message) => (
          // <MessageItem/>
          <div key={message.id}>
            {message.body}
          </div>
        ))}
      </Flex>
    )
    }
  </Flex> 
  );
}
 
export default Messages;