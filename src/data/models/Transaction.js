import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    date: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, enum: ['Pending', 'Posted'] },
    counterparty: { type: String, required: true },
    methodCode: { type: Number, required: true },
    note: { type: String }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;