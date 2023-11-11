// import { ConversationPopulated } from '../../../backend/src/util/types'

/**
 * Users
 */

export interface CreateUsernameData {
  createUsername: {
    success: boolean
    error: string
  }
}

export interface CreateUsernameVariables {
  username: string
}

export interface SearchUsersInput {
  username: string
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>
}

export interface SearchedUser {
  id: string
  username: string
}

/**
 * Conversations
 */

interface ConversationUser {
  id: string
  username: string
}

interface ConversationLatestMessage {
  id: string
  sender: ConversationUser
  body: string
  createdAt: Date
}

interface ConversationParticipant {
  user: ConversationUser
  hasSeenLatestMessage: boolean
}

export interface ConversationPopulated {
  id: string
  participants: Array<ParticipantPopulated>
  latestMessage?: ConversationLatestMessage
  updatedAt: Date
}

export interface ParticipantPopulated {
  user: {
    id: string;
    username: string | null;
  };
  id: string;
  userId: string;
  conversationId: string;
  hasSeenLatestMessage: boolean;
}

export interface ConversationsData {
  conversations: Array<ConversationPopulated>
}

export interface CreateConversationData {
  createConversation: {
    conversationId: string
  }
}

export interface CreateConversationInput {
  participantIds: Array<string>
}

export interface ConversationUpdatedData {
  conversationUpdated: {
    conversation: ConversationPopulated
  }
}

export interface ConversationSubscriptionData {
  subscriptionData: {
    data: { 
      conversationCreated: ConversationPopulated 
    } 
  }
}

export interface MarkConversationAsReadData {

}

export interface MarkConversationAsReadInput {
  userId: string
  conversationId: string
}

/**
 * Messages
 */


export interface MessageSender {
  id: string;
  username: string | null
}

export interface MessagePopulated {
  id: string
  createdAt: Date
  updatedAt: Date
  senderId: string
  body: string
  conversationId: string
  sender: MessageSender
}

export interface MessagesData {
  messages: Array<MessagePopulated>
}

export interface MessagesVariables {
  conversationId: string
}

export interface SendMessageInput {
  id: string
  conversationId: string
  senderId: string
  body: string
}

export interface MessageSubscriptionData {
  subscriptionData: {
    data: {
      messageSent: MessagePopulated
    }
  }
}

