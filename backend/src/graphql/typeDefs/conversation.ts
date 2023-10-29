import gql from 'graphql-tag';

const typeDefs = gql`
  scalar Date

  type Query {
    conversations: [Conversation]
  }

  type Mutation {
    createConversation(participantIds: [String]): CreateConversationResponse
  }

  type Subscription {
    conversationCreated: Conversation
  }

  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
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