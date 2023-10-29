import { ISODateString } from "next-auth";
import { Prisma, PrismaClient } from "@prisma/client";
import { conversationPopulated, participantPopulated } from '../graphql/resolvers/conversation';
import { Context } from 'graphql-ws/lib/server'
import { PubSub } from 'graphql-subscriptions';
/**
 * Server configuration
 */

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub
}

export interface Session {
  user: User;
  expires: ISODateString
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session
  }
}

/**
 * Users
 */

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
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

export type ConversationPopulated = Prisma.ConversationGetPayload<{ 
  include: typeof conversationPopulated 
}>

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated
}>

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated
}