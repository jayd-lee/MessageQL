import { Box } from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import Chat from '../components/Chat/Chat';
import Auth from '../components/Auth/Auth';
import { authOptions } from './api/auth/[...nextauth]';

const Page = () => {
  const { data: session } = useSession()
  console.log('Here is Data', session)

  const reloadSession = () => {}
  return ( 
    <Box>
      {session?.user?.username ? <Chat /> : <Auth session={session} reloadSession={reloadSession} /> }
    </Box>
  );
}
export async function getServerSideProps(context : any) {
  const session = await getServerSession(context.req, context.res, authOptions)

  return {
    props: {
      session,
    }
  }


}

export default Page;