import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    chargerPointId: {
        type: String,
        required: true,
    },
    transactionId: {
        type: Number,
        required: true,
    },
    user:{
        type: String,
        required: true
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
},
    { timestamps: true }
);

export default mongoose.model('Transaction', TransactionSchema);
