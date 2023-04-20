import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CostSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description:{type: String,
        required: true,},
    active: {
        type: Boolean,
        default: true
    },
    priceComponents: [{
        tax: String,
        type_: String,
        price: String,
        gracePeriod: String
    }]
},
    { timestamps: true }
);

export default mongoose.model('Cost', CostSchema);
