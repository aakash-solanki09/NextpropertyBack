const property = require("../../models/property/property");
const { uploadToCloudinary } = require("../../utils/cloudinary");

const createProperty = async (req, res) => {
  // Check if the user is an admin

  try {
    const {
      title,
      description,
      typeOfProperty,
      listingType,
      location,
      price,
      bhk,
      carpetArea,
      buildUpArea,
      furnishedType
    } = req.body;

    let imageUrls = [];

    // Upload multiple images to Cloudinary
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer))
      );
      imageUrls = uploads.map(upload => upload.secure_url);
    }

    const newProperty = await property.create({
      title,
      description,
      images: imageUrls,
      typeOfProperty,
      listingType,
      location,
      price,
      bhk,
      carpetArea,
      buildUpArea,
       furnishedType
    });

    res.status(201).json({
      message: "Property created successfully",
      newProperty
    });
  } catch (error) {
    console.error("Error in creating property:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


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
    const properties = await property.find();
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
      listingType,
      location,
      price,
       bhk,
      area,
      carpetArea,
      buildUpArea,
       furnishedType
    } = req.body;

    // Convert to array if FormData sends a single string
    const existingImages = Array.isArray(req.body.existingImages)
      ? req.body.existingImages
      : req.body.existingImages ? [req.body.existingImages] : [];

    const imagesToRemove = Array.isArray(req.body.imagesToRemove)
      ? req.body.imagesToRemove
      : req.body.imagesToRemove ? [req.body.imagesToRemove] : [];

    // Upload new files to Cloudinary
    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploads = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer))
      );
      newImageUrls = uploads.map(upload => upload.secure_url);
    }

    // Optionally: delete removed images from Cloudinary here if needed
    // You'd need to track the public_id of each image when you first upload them.

    const finalImageUrls = [...existingImages, ...newImageUrls];

    const updatedProperty = await property.findByIdAndUpdate(
      propertyId,
      {
        title,
        description,
        images: finalImageUrls,
        typeOfProperty,
        listingType,
        location,
        price,
        bhk,
        area,
        carpetArea,
        buildUpArea,
         furnishedType
      },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property updated successfully", updatedProperty });
  } catch (error) {
    console.error("Error in updating property:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const deleteProperty = async (req, res) => {
  const propertyId = req.params.id;

  try {
    // Corrected: use the lowercase model name you imported
    const deletedProperty = await property.findByIdAndDelete(propertyId);

    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    return res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error in deleting property:", error.message, error.stack);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports={
    createProperty,
     getAllPublicProperties,
    getPropertyById,
    updateProperty,
    deleteProperty
}