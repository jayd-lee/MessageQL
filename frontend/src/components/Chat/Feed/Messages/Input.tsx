import { useMutation } from '@apollo/client';
import { Box, Input } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { useState } from 'react';
import toast from 'react-hot-toast';
import MessageOperations from '../../../../graphql/operations/message'
import { MessagesData, SendMessageInput } from '@/util/types';
import { ObjectId } from 'bson'

interface MessageInputProps {
  session: Session
  conversationId: string
}

const MessageInput: React.FC<MessageInputProps> = ({
  session, conversationId
}) => {

  const [ sendMessage ] = useMutation<{ sendMessage: boolean}, SendMessageInput>(
    MessageOperations.Mutation.sendMessage)

  const [messageBody, setMessageBody] = useState('')

  const onSendMessage = async(event: React.FormEvent) => {
    
    event.preventDefault()

    if (!messageBody) return null

    try {
      const { user: { id: senderId } } = session
      const messageId = new ObjectId().toString()
      const newMessage: SendMessageInput = {
        id: messageId,
        senderId,
        conversationId,
        body: messageBody
      }

      const { data, errors } = await sendMessage({
         variables: {
          ...newMessage
        },
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          const existing = cache.readQuery<MessagesData>({
            query: MessageOperations.Query.messages,
            variables: {conversationId}
          }) as MessagesData
          
          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [{ 
                id: messageId,
                body: messageBody,
                senderId: session.user.id,
                conversationId,
                sender: {
                  id: session.user.id,
                  username: session.user.username,
                },
                createdAt: new Date(Date.now()), 
                updatedAt: new Date(Date.now()) 
              }, ...existing.messages]
            }
          })
        }
        })

      if (!data?.sendMessage || errors) throw new Error('failed to send message')

    } catch(error: any) {
      console.log('onSendMessage error', error)
      toast.error(error?.message)
    }

    setMessageBody('')
  }

  return ( 
  <Box px={4} py={6} width='100%'>
    <form onSubmit={onSendMessage}>
      <Input
        value={messageBody}
        onChange={(event) => setMessageBody(event.target.value)}
        placeholder='New Message'
        size='md'
        resize='none'
        _focus={{
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'whiteAlpha'
        }}
      />
    </form>

  </Box> 
  );
}
 
export default MessageInput;