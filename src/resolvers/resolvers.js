import Transaction from "../data/models/transaction";
import methodMappings from "../data/methodMappings";

const resolvers = {
  Query: {
    transactions: async () => {
      try {
        const transactions = await Transaction.find();
        return transactions;
      } catch (error) {
        throw new Error(`Error fetching transactions: ${error.message}`);
      }
    },

    transactionsByMethodName: async (_, { methodName }) => {
      try {
        const methodMapping = methodMappings.find((mapping) => mapping.methodName === methodName);

        if (!methodMapping) {
          throw new Error("methodName not found");
        }

        const transaction = await Transaction.find({ methodCode: methodMapping.methodCode });
        return transaction;
      } catch (error) {
        throw new Error(`Error fetching transaction by method name: ${error.message}`);
      }
    },

    currentAccountBalance: async () => {
      try {
        const transactions = await Transaction.find();
        const balance = transactions.reduce((total, transaction) => total += transaction.amount, 0);
        return balance;
      } catch (error) {
        throw new Error(`Error calculating current account balanace: ${error.message}`);
      }
    },

    methodCodeToMethodNameMapping: async () => {
      return methodMappings;
    }
  },

  Mutation: {
    createTransaction: async (_, { input }) => {
      try {
        const transaction = new Transaction(input);
        await transaction.save();
        return transaction;
      } catch (error) {
        throw new Error(`Failed to create a transaction: ${error.message}`);
      }
    },

    updateTransaction: async (_, { id, input }) => {
      try {
        const transaction = await Transaction.findByIdAndUpdate(id, input, { new: true });
        return transaction;
      } catch (error) {
        throw new Error(`Failed to update a transaction: ${error.message}`);
      }
    },

    deleteTransaction: async (_, { id }) => {
      try {
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
    
        if (!deletedTransaction) {
          throw new Error(`Transaction was not found with id: ${id}`);
        }
    
        return id;
      } catch (error) {
        throw new Error(`Failed to delete a transaction: ${error.message}`);
      }
    }
  },
};

export default resolvers;
