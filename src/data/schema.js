import { buildSchema } from "graphql";

const typeDefs = 
buildSchema(
  `type Transaction {
    id: ID!
    date: String!
    amount: Float!
    status: String!
    counterparty: String!
    methodCode: Int!
    note: String
  }
  
  type Query {
    transactions: [Transaction!]!
    transactionsByMethodName(methodName: String!): [Transaction!]!
    currentAccountBalance: Float!
    methodCodeToMethodNameMapping: [MethodMapping!]!
  }
  
  type Mutation {
    createTransaction(input: TransactionInput!): Transaction!
    updateTransaction(id: ID!, input: TransactionInput!): Transaction!
    deleteTransaction(id: ID!): ID!
  }
  
  input TransactionInput {
    date: String!
    amount: Float!
    status: String!
    counterparty: String!
    methodCode: Int!
    note: String
  }
  
  type MethodMapping {
    methodCode: Int!
    methodName: String!
  }
  `);

export default typeDefs;