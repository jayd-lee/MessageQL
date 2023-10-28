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

interface ConversationsUser {
  id: string
  username: string
}

interface ConversationsLatestMessage {
  id: string
  sender: ConversationsUser
  body: string
  createdAt: string
}

interface ConversationsParticipant {
  user: ConversationsUser
  hasSeenLatestMessage: boolean
}

export interface ConversationsPopulated {
  id: string
  participants: Array<ConversationsParticipant>
  latestMessage?: ConversationsLatestMessage
  updatedAt: string
}

export interface ConversationsData {
  conversations: Array<ConversationsPopulated>
}

export interface CreateConversationData {
  createConversation: {
    conversationId: string
  }
}

export interface CreateConversationInput {
  participantIds: Array<string>
}