import gql from 'graphql-tag';


const typeDefs = gql`
scalar Data
  
  type Message {
    id: String
    sender: User
    body: String
    createdAt: Date
  }

`

export default typeDefs
