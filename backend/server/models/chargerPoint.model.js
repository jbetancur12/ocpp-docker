import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ConnectorSchema = new mongoose.Schema({
  format: {
    type: String,
    required: true,
    default: "Cable"
  },
  type: {
    type: String,
    required: true
  },
  powerType: {
    type: String,
    required: true
  },
  power: {
    type: Number,
    required: true
  },
  status:{
    type: String,
    required: true,
    default: "Available"
  },
  info:{
    type: String
  },
  errorCode:{
    type: String,
    required: true,
    default: "NoError"
  }
});

const ChargerPointSchema = new Schema({
  charger_box_id: {
    type: String,
    required: true,
  },
  status:{
    type: String,
    required: true,
    default: "offline"
  },
  connectors: {
    type: [ConnectorSchema],
    //required: true
  },
  rates:{
    type:Schema.Types.ObjectId, 
    ref: "Cost",
    required: true,
},
location: {
    type:Schema.Types.ObjectId, 
    ref: "Location",
},
  ocpp_protocol: {
    type: String,
    required: false,
  },
  registration_status: {
    type: String,
    required: false,
  },
  charge_point_vendor: {
    type: String,
    required: false,
  },
  charger_point_model: {
    type: String,
    required: false,
  },
  charger_point_serial_number: {
    type: String,
    required: false,
  },
  charger_box_serial_number: {
    type: String,
    required: false,
  },
  fw_version: {
    type: String,
    required: false,
  },
  fw_update_status: {
    type: String,
    required: false,
  },
  fw_update_timestamp: {
    type: Date,
    required: false,
  },
  meter_type: {
    type: String,
    required: false,
  },
  meter_serial_number: {
    type: String,
    required: false,
  },
  diagnostics_status: {
    type: String,
    required: false,
  },
  diagnostics_timestamp: {
    type: Date,
    required: false,
  },
  last_heartbeat_timestamp: {
    type: Date,
    required: false,
  },
  iccid: {
    type: String,
    required: false,
  },
  imsi: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  note: {
    type: String,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

export default mongoose.model('ChargerPoint', ChargerPointSchema);
