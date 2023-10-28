import { ISODateString } from "next-auth";
import { Prisma, PrismaClient } from "@prisma/client";
import { conversationPopulated, participantPopulated } from '../graphql/resolvers/conversation';


export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  // pubsub
}

/**
 * Users
 */

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}

export interface Session {
  user: User;
  expires: ISODateString
}

export interface User {
  id: string;
  username: string;
  name: string;
  image: string;
  email: string;
  emailVerified: boolean;
}

/**
 * Conversations
 */

export type ConversationsPopulated = Prisma.ConversationGetPayload<{ 
  include: typeof conversationPopulated 
}>

export type ParticipantsPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated
}>