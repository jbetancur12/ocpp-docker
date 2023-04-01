import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address:{type: String,
        required: true,},
    city: {
        type: String,
        default: true
    },
    latitude: {
        type: String,
        default: true
    },
    longitude: {
        type: String,
        default: true
    },
    chargerPoints: [{
        type: Schema.Types.ObjectId,
        ref: "ChargerPoint"
    }]

},
    { timestamps: true }
);

export default mongoose.model('Location', LocationSchema);
