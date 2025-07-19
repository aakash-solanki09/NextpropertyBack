const property = require("../../models/property/property");
const User = require("../../models/user/user");
const { uploadToCloudinary } = require("../../utils/cloudinary");

const createProperty = async (req, res) => {
if (!req.user || !req.user._id) {
  return res.status(401).json({ message: "Unauthorized. User not found." });
}

  try {
    const {
      title,
      description,
      typeOfProperty,
      location,
      price,
      contactNumber
    } = req.body;

    let imageUrl = null;

    // Upload image to Cloudinary if present
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const newProperty = await property.create({
      title,
      description,
      imageUrl,
      typeOfProperty,
      location,
      price,
      contactNumber,
      user: req.user._id
    });

    res.status(201).json({ message: "Property created successfully", newProperty });
  } catch (error) {
    console.error('Error in creating property:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllProperties = async (req, res) => {
  try {
    const properties = await property.find({user: req.user._id});
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error in fetching properties:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
    

const getPropertyById = async (req, res) => {
  const propertyId = req.params.id;
  try {
    const propertyData = await property.findById(propertyId);
    if (!propertyData) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(propertyData);
  } catch (error) {
    console.error('Error in fetching property by ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllPublicProperties = async (req, res) => {
  try {
    const properties = await property.find().populate("user", "name email");
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching all public properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


  const updateProperty = async (req, res) => {
  const propertyId = req.params.id;
 
  try {
    const {
      title,
      description,
      typeOfProperty,
      location,
      price,
      contactNumber
    } = req.body;

    let imageUrl = req.body.imageUrl; // default to existing if not uploading

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const updatedProperty = await property.findByIdAndUpdate(
      propertyId,
      {
        title,
        description,
        imageUrl,
        typeOfProperty,
        location,
        price,
        contactNumber
      },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property updated successfully", updatedProperty });
  } catch (error) {
    console.error('Error in updating property:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
   


const deleteProperty = async (req, res) => {
  const propertyId = req.params.id;
  try {
    const deletedProperty = await property.findByIdAndDelete(propertyId);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error('Error in deleting property:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}   




module.exports={
    createProperty,
    getAllProperties,
     getAllPublicProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
}