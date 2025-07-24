const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  bhk: { type: Number, min: 0, default: null },
  images: [{ type: String, required: true }],
  buildUpArea: { type: Number, min: 0, default: null },
  carpetArea: { type: Number, min: 0, default: null },
  typeOfProperty: { type: String, required: true, trim: true },
  listingType: { type: String, enum: ['rent', 'sale'], required: true },
  location: { type: String, required: true, trim: true },
  landmark: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  furnishedType: { 
    type: String, 
    enum: ['furnished', 'semi-furnished', 'unfurnished'], 
    default: 'unfurnished' 
  },
  mobileNum: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit mobile number!`
    }
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Property', propertySchema);
