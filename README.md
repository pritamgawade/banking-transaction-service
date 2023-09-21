## Banking Transaction Service
The Banking Transaction Service is a GraphQL API that manages banking transactions. It allows you to create, retrieve, update, and delete transactions while also providing information about account balances and method code mappings.
It's built using Node.js, GraphQL, and MongoDB to provide a powerful and scalable solution for handling transactions.

### Features
- Create new banking transactions with various attributes.
- Retrieve transaction details and account balances.
- Update existing transactions.
- Delete transactions by their unique identifiers.
- Fetch method code to method name mappings.

### Prerequisites
Before running the Banking Transaction Service, ensure you have the following software installed on your system:

- Node.js
- MongoDB

### Installation

1. Install dependencies: 
`npm install`

2. Start server:
`npm start`

The service should now be running on http://localhost:8000

### GraphQL API
#### Endpoints
GraphQL API endpoint: http://localhost:your-port/graphql

Here are some example queries and mutations:

1. Create a Transaction:
```
mutation {
  createTransaction(input: {
    date: "2023-09-20",
    amount: 100,
    status: "Pending",
    counterparty: "abc Company",
    methodCode: 12,
    note: "Create transaction"
  }) {
    id
    date
    amount
    status
    counterparty
    methodCode
    note
  }
} 

```
2. Retrieve Transactions:
```
query {
  transactions {
    id
    date
    amount
    status
    counterparty
    methodCode
    note
  }
}
```
3. Retrieve transactions bny method name:
```
query {
  transactionsByMethodName(methodName: "Method Name"){
    id
    date
    amount
    status
    counterparty
    methodCode
    note
  }
}
```
4. Retrieve current account balance
```
query {
  currentAccountBalance
}
```
5. Retrieve mapping of method code to method name
```
query {
  methodCodeToMethodNameMapping {
    methodCode
    methodName
  }
}
```
6. Update a Transaction:
 ```
 mutation {
  updateTransaction(id: "transaction-id", input: {
    date: "2023-09-21",
    amount: 200,
    status: "Posted",
    counterparty: "New tech organization",
    methodCode: 88,
    note: "Updated transaction data"
  }) {
    id
    date
    amount
    status
    counterparty
    methodCode
    note
  }
}
```
7. Delete a Transaction:
```
mutation {
  deleteTransaction(id: "transaction-id")
}
```
### Testing
We have included a suit of tests using Jest to ensure the reliability of Banking Transaction Service.
You can run these tests using the following command:

`npm test`
