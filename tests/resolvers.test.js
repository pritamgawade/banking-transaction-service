import resolvers from "../src/resolvers/resolvers";
import Transaction from "../src/data/models/transaction";
import methodMappings from "../src/data/methodMappings";
import mongoose from 'mongoose';

const transactionData = [
    {
        "id": "650a0131197d1356b14456ec",
        "date": "2023-09-20",
        "amount": 100,
        "status": "Pending",
        "counterparty": "abc Company",
        "methodCode": 12,
        "note": "Sample transaction"
    },
    {
        "id": "650b24361c79b88761b7435e",
        "date": "2023-09-20",
        "amount": 200,
        "status": "Posted",
        "counterparty": "Tech organization",
        "methodCode": 78,
        "note": "Transaction data"
    }
];

const input = {
    "date": "2023-09-20",
    "amount": 100,
    "status": "Pending",
    "counterparty": "abc Company",
    "methodCode": 12,
    "note": "Sample transaction"
};

const mockError = new Error('Database Error');

const mockFind = jest.fn();
const mockSave = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindByIdAndDelete = jest.fn();

Transaction.find = mockFind;
Transaction.prototype.save = mockSave;
Transaction.findByIdAndUpdate = mockFindByIdAndUpdate;
Transaction.findByIdAndDelete = mockFindByIdAndDelete;

const setupMockFind = (data) => {
    mockFind.mockResolvedValue(data);
};

describe('Test Resolvers', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Query', () => {
        describe('transaction', () => {
            it('should fetch transactions successfully', async () => {
                setupMockFind(transactionData);
                const result = await resolvers.Query.transactions();

                expect(mockFind).toHaveBeenCalledTimes(1);
                expect(result).toEqual(transactionData);
            });

            it('should handle errors when fetching transactions', async () => {
                mockFind.mockRejectedValueOnce(mockError);

                try {
                    await resolvers.Query.transactions();

                    expect(true).toBe(false);
                } catch (error) {
                    expect(mockFind).toHaveBeenCalledTimes(1);
                    expect(error.message).toContain(`Error fetching transactions`);
                }
            });
        });

        describe('transactionsByMethodName', () => {
            it('it should fetch transactions by method name', async () => {
                const methodName = 'Fee';

                setupMockFind(transactionData[1]);

                const result = await resolvers.Query.transactionsByMethodName(null, { methodName });

                expect(mockFind).toHaveBeenCalledTimes(1);
                expect(result).toEqual(transactionData[1]);
            });

            it('should throw an error if method name not found', async () => {
                const methodName = 'No method';

                setupMockFind([]);

                try {
                    await resolvers.Query.transactionsByMethodName(null, { methodName });
                } catch (error) {
                    expect(error.message).toBe('Error fetching transaction by method name: methodName not found');
                }

            });
        });

        describe('currentAccountBalance', () => {
            it('should calculate current account balance', async () => {
                setupMockFind(transactionData);

                const result = await resolvers.Query.currentAccountBalance();

                const expectedBalance = transactionData.reduce((total, transaction) => total += transaction.amount, 0);

                expect(mockFind).toHaveBeenCalled();
                expect(result).toBe(expectedBalance);
            });

            it('should handle an error when calculating current account balance', async () => {
                mockFind.mockRejectedValueOnce(mockError);

                try {
                    await resolvers.Query.currentAccountBalance();
                    expect(true).toBe(false);
                } catch (error) {
                    expect(error.message).toContain('Error calculating current account balanace: Database Error');
                }
            });
        });

        describe('methodCodeToMethodNameMapping', () => {
            it('should fetch method code to method name mapping', async () => {
                const result = await resolvers.Query.methodCodeToMethodNameMapping();

                expect(result).toEqual(methodMappings);
            });
        });

    });

    describe('Mutations', () => {
        describe('createTransaction', () => {
            it('should create a new transaction', async () => {
                const result = await resolvers.Mutation.createTransaction(null, { input });

                expect(mockSave).toHaveBeenCalledTimes(1);
                expect(mockSave).toHaveBeenCalledWith();
                expect(result).toEqual(expect.objectContaining(input));
            });

            it('should throw an error if it failed to create a transaction', async () => {
                mockSave.mockRejectedValueOnce(new Error(mockError));

                try {
                    await resolvers.Mutation.createTransaction(null, { input });
                    expect(true).toBe(false);
                } catch (error) {
                    expect(mockSave).toHaveBeenCalledTimes(1);
                    expect(error.message).toContain('Failed to create a transaction');
                }
            });
        });

        describe('updateTransaction', () => {
            it('it should update a transaction', async () => {
                const id = new mongoose.Types.ObjectId();

                mockFindByIdAndUpdate.mockResolvedValueOnce(input);

                const result = await resolvers.Mutation.updateTransaction(null, { id, input });

                expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(1);
                expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(id, input, { new: true });
                expect(result).toEqual(input);
            });

            it('should throw an error if it fails to update a transaction', async () => {
                mockFindByIdAndUpdate.mockRejectedValueOnce(new Error(mockError));

                try {
                    await resolvers.Mutation.updateTransaction(null, { input });
                    expect(true).toBe(false);
                } catch (error) {
                    expect(mockFindByIdAndUpdate).toHaveBeenCalledTimes(1);
                    expect(error.message).toContain('Failed to update a transaction');
                }
            });
        });

        describe('deleteTransaction', () => {
            it('should delete a transaction', async () => {
                const id = new mongoose.Types.ObjectId();
                mockFindByIdAndDelete.mockResolvedValueOnce({ _id: id });

                const result = await resolvers.Mutation.deleteTransaction(null, { id });

                expect(mockFindByIdAndDelete).toHaveBeenCalledTimes(1);
                expect(mockFindByIdAndDelete).toHaveBeenCalledWith(id);
                expect(result).toBe(id);
            });

            it('should throw an error when transaction not found', async () => {
                const id = '7678yv68769879gb88';

                mockFindByIdAndDelete.mockResolvedValueOnce(null);

                try {
                    await resolvers.Mutation.deleteTransaction(null, { id });
                } catch (error) {
                    expect(error.message).toContain('Transaction was not found with id');
                }
            });

            it('should throw an error if it fails to delete a transaction', async () => {
                const id = new mongoose.Types.ObjectId();
                mockFindByIdAndDelete.mockRejectedValueOnce(new Error(mockError));

                try {
                    await resolvers.Mutation.deleteTransaction(null, { id });
                    expect(true).toBe(false);
                } catch (error) {
                    expect(error.message).toContain('Failed to delete a transaction');
                }
            });
        });

    });
});