const Contact = require("../../models/contact/Contact");

// ✅ CREATE contact
const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const contact = await Contact.create({ name, email, message });

    res.status(201).json({ success: true, message: "Contact message created", contact });
  } catch (error) {
    console.error("Error creating contact:", error.message);
    res.status(500).json({ success: false, message: "Server error. Try again later." });
  }
};

// ✅ GET ALL contacts (admin, sorted, optional search)
const getAllContacts = async (req, res) => {
  try {
    const { sort = "desc", search = "" } = req.query;

    const sortOrder = sort === "asc" ? 1 : -1;

    // optional name/email filtering
    const filter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const contacts = await Contact.find(filter).sort({ createdAt: sortOrder });

    res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      total: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch contacts" });
  }
};

module.exports = { createContact, getAllContacts };
