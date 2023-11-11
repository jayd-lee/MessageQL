import gql from 'graphql-tag';

const typeDefs = gql`
  scalar Date

  type Query {
    conversations: [Conversation]
  }

  type Mutation {
    createConversation(participantIds: [String]): CreateConversationResponse
    markConversationAsRead(userId: String!, conversationId: String!): Boolean
  }

  type Subscription {
    conversationCreated: Conversation
    conversationUpdated: ConversationUpdatedSubcriptionPayload
  }

  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }

  type ConversationUpdatedSubcriptionPayload {
    conversation: Conversation
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }


  type CreateConversationResponse {
    conversationId: String
  }
`

export default typeDefs;