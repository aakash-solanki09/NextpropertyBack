const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multer/upload');
const propertyController = require('../../controller/property/propertyController');
const auth = require('../../middleware/auth/auth');

router.post(
  '/properties',
  auth,
  upload.array('images', 5),
  propertyController.createProperty
);

router.put(
  '/properties/:id',
  auth,
  upload.array('images', 5),
  propertyController.updateProperty
);

router.get('/properties/:id', auth, propertyController.getPropertyById);

// RESTful: use same base path for listing
router.get('/properties',  propertyController.getAllPublicProperties);

router.delete('/properties/:id', auth, propertyController.deleteProperty);

module.exports = router;
