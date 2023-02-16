import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TransactionIdSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    transactionId: {
        type: Number,
        required: true,
    },
    
}
);

export default mongoose.model('TransactionId', TransactionIdSchema);
