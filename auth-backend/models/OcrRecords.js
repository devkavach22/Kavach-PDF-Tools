// models/OcrRecord.js
const mongoose = require('mongoose');

const ocrRecordSchema = new mongoose.Schema({
  // Define your schema fields here
  data: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OcrRecord', ocrRecordSchema);

// auth-backend/routes/authRoutes.js
// const OcrRecord = require('../models/OcrRecord'); // Correctly import the model

// // ... inside your route handler ...
// try {
//   const newRecord = new OcrRecord({ data: 'some OCR data' });
//   await newRecord.save(); // Mongoose uses .save() on an instance
//   // Or, if you want to use insertOne directly on the model:
//   // await OcrRecord.insertOne({ data: 'some OCR data' });
// } catch (error) {
//   console.error(error);
// }