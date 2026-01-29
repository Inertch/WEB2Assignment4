const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  temperature: { type: Number, required: true }, 
  humidity: { type: Number, required: true },
  co2: { type: Number, required: true }  
});

module.exports = mongoose.model('Measurement', measurementSchema);
