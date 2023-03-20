import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CostSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
},
    { timestamps: true }
);

export default mongoose.model('Cost', CostSchema);
