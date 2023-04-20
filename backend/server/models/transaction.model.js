import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    chargerPointId: {
        type:Schema.Types.ObjectId, 
        ref: "ChargerPoint",
        required: true,
    },
    transactionId: {
        type: Number,
        required: true,
    },
    user:{
        type:Schema.Types.ObjectId, 
        ref: "User",
    },
    connectorId: {
        type: Number,
        required: true,
    },
    start_timestamp: {
        type: Date,
        required: true,
    },
    start_value: {
        type: Number,
        required: true,
    },
    stop_timestamp: {
        type: Date,
        required: true,
    },
    stop_value: {
        type: Number,
        required: true,
    },
    cost: {
        type: Number,
        default: 0,
    },
    time:{
        type: Number,
        default: 0,
    }
},
    { timestamps: true }
);

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction;
