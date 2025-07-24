const express = require('express');
const { createContact, getAllContacts } = require('../../controller/contact/contactController');

const router = express.Router();

router.post('/', createContact);
router.get('/', getAllContacts);

module.exports = router;
