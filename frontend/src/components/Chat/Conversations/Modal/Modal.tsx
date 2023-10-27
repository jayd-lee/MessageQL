import { 
  Text, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody, 
  Modal, 
  Stack, 
  Input, 
  Button 
} from '@chakra-ui/react';
import { useState } from 'react';
import UserOperations from '@/graphql/operations/user'
import { useLazyQuery, useQuery } from '@apollo/client';
import { SearchUsersData, SearchUsersInput, SearchedUser } from '@/util/types';
import UserSearchList from './UserSearchList';
import Participants from './Participants';
import toast from 'react-hot-toast';

interface ModalProps {
  isOpen: boolean
  onClose: () => void
 }

const ConversationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose
}) => {

  const [username, setUsername] = useState('')
  const [participants, setParticipants] = useState<Array<SearchedUser>>([])

  const [searchUsers, {data, error, loading}] = useLazyQuery<
  SearchUsersData,
  SearchUsersInput
  >(UserOperations.Queries.searchUsers)


  const onCreateConversation = () => {
    try {
      // createConversation mutation
    } catch(error: any) {
      console.log('onCreateConversation error', error)
      toast.error(error?.message)
    }
  }

  const onSearch = (event: React.FormEvent) => {
    event.preventDefault()
    searchUsers({ variables: { username } })
  }

  const addParticipant = (user: SearchedUser) => {
    setParticipants((prev) => [...prev, user])
    setUsername('')
  }
  const removeParticipant = (userId: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== userId))
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg='#2d2d2d' pb={4}>
          <ModalHeader>Create a conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4} >
                <Input 
                placeholder='Enter a username'
                value={username}
                onChange={(event) => setUsername(event.target.value)} />
                <Button type='submit' disabled={!username} isLoading={loading}
                >
                  Search
                </Button>
              </Stack>
            </form>
            {data?.searchUsers && 
            <UserSearchList users={data.searchUsers} addParticipant={addParticipant} /> 
            }
            
            { participants.length !== 0 && (
            <>
              <Participants 
              participants={participants} 
              removeParticipant={removeParticipant}
              />
              <Button 
              bg='brand.100'
              width='100%' 
              mt={6} 
              _hover={{ bg: 'brand.100' }}
              onClick={() => {}}
              >
                Create Conversation
              </Button>

            </>
            )} 
          </ModalBody>

        </ModalContent>
      </Modal>
    </>
  )
}
 
export default ConversationModal;