const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  bhk: { type: Number,  min: 0,default: null},
  area: { type: Number, min: 0,default: null},
  images: [{ type: String, required: true }], 
  buildUpArea: { type: Number,  min: 0 ,default: null },
  carpetArea: { type: Number,  min: 0 ,default: null },
  typeOfProperty: { type: String, required: true, trim: true },
  listingType: { type: String, enum: ['rent', 'sale'], required: true },
  location: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Property', propertySchema);
