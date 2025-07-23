const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  images: [{ type: String, required: true }], 
  typeOfProperty: { type: String, required: true, trim: true },
  listingType: { type: String, enum: ['rent', 'sale'], required: true },
  location: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Property', propertySchema);
