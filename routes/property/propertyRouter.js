const express = require('express');
const router = express.Router();
const upload = require('../../middleware/multer/upload')
const propertyController = require('../../controller/property/propertyController');
const auth = require('../../middleware/auth/auth');

router.post(
  '/properties',
  auth,
  upload.single('image'),
  propertyController.createProperty
);

router.put(
  '/properties/:id',
  auth,
  upload.single('image'),
  propertyController.updateProperty
);

router.get('/properties', auth, propertyController.getAllProperties);
router.get('/properties/:id', auth, propertyController.getPropertyById);
router.get('/all-properties',auth, propertyController.getAllPublicProperties); 
router.delete('/properties/:id', auth, propertyController.deleteProperty);

module.exports = router;
