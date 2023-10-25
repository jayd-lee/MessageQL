import { useMutation } from '@apollo/client';
import { Button, Center, Stack, Text, Image, Input } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import UserOperations from '@/graphql/operations/user'
import { CreateUsernameData, CreateUsernameVariables } from '../../util/types';


interface AuthProps {
  session: Session | null
  reloadSession: () => void
}


const Auth: React.FC<AuthProps> = ({ session, reloadSession}) => {
  const [username, setUsername] = useState('')
  const [createUsername, { data, loading, error }] = useMutation<
  CreateUsernameData, 
  CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);


  console.log("DATA FOR THE username", data, loading, error)
  const onSubmit = async () => {
    if (!username) return;
    try {
      await createUsername({ variables: { username } });
    } catch (e) {
      console.log('onSubmit error', e)
    }
  }
  return ( 
  <Center height='100vh'>
    <Stack spacing={8} align='center' >
      {session ? (
        <>
          <Text fontSize='3xl'>Create a Username</Text>
          <Button onClick={() => signOut()}> log out</Button>

          <Input 
            placeholder='Enter a username' 
            value={username} 
            onChange={(event) => setUsername(event.target.value)} />
          <Button width='100%' onClick={onSubmit}>Save</Button>
        </>
      ) : 
      <>
        <Text fontSize={'3xl'}>MessageQL</Text>
        <Button onClick={() => signIn('google')} leftIcon={<Image height='20px' src='/images/googlelogo.png' />}>
          Continue with Google
        </Button>
      </>
      }
    </Stack>
  </Center> 
  
  );
}
 
export default Auth;