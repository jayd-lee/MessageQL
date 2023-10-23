import { Button, Center, Stack, Text, Image, Input } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useState } from 'react';


interface AuthProps {
  session: Session | null
  reloadSession: () => void
}

const Auth: React.FC<AuthProps> = ({ session, reloadSession}) => {
  const [username, setUsername] = useState('')
  
  const onSubmit = async () => {
    try {
      // createUsername mutation to send username to GraphQL API
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