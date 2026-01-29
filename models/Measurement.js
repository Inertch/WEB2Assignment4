const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  field1: { type: Number, required: true }, // e.g. temperature
  field2: { type: Number, required: true }, // e.g. humidity
  field3: { type: Number, required: true }  // e.g. CO2 levels
  // add more fields if needed
});

module.exports = mongoose.model('Measurement', measurementSchema);
