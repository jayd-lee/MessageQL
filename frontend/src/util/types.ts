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
  createdAt: string
}

interface ConversationParticipant {
  user: ConversationUser
  hasSeenLatestMessage: boolean
}

export interface ConversationPopulated {
  id: string
  participants: Array<ConversationParticipant>
  latestMessage?: ConversationLatestMessage
  updatedAt: string
}

export interface ParticipantPopulated {
  user: ConversationUser
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

/**
 * Messages
 */


export interface MessageSender {
  id: string;
  username: string | null
}

export interface MessagePopulated {
  id: string
  createdAt: string // assuming date is serialized as a string
  updatedAt: string // assuming date is serialized as a string
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