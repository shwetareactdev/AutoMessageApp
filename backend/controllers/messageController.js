const Message = require('../models/messageModel');

// Add a new message
exports.addMessage = async (req, res) => {
  const { type, text } = req.body; // Get "text" and "type" from the request body
  try {
    const newMessage = new Message({ type, text }); // Create a new message object
    await newMessage.save(); // Save the new message

    const messages = await Message.find({ type }); // Fetch all messages of this type
    res.status(201).json({ message: 'Message added successfully', messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding message', details: error });
  }
};

// Get all messages for a specific type (incoming / outgoing / missed)
exports.getMessages = async (req, res) => {
  const { type } = req.params; // Extract type from URL parameters
  try {
    const messages = await Message.find({ type }); // Fetch all messages of this type
    const defaultMessageDoc = await Message.findOne({ type, isDefault: true });

    res.status(200).json({ 
      messages, 
      defaultMessage: defaultMessageDoc ? defaultMessageDoc.text : null 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching messages', details: error });
  }
};

// Set default message
exports.setDefaultMessage = async (req, res) => {
  const { id } = req.body; // Get message ID from request body
  try {
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Clear any previous default messages for this type
    await Message.updateMany({ type: message.type, isDefault: true }, { $set: { isDefault: false } });

    // Set the current message as the default
    message.isDefault = true;
    await message.save();

    res.status(200).json({ message: 'Default message set successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error setting default message', details: error });
  }
};

// Delete a message by ID for a specific call type
exports.deleteMessage = async (req, res) => {
  const { type, id } = req.params; // Extract both type and message ID from URL parameters
  console.log("Attempting to delete message with ID:", id, "of type:", type);

  try {
    // Find and delete the message by both type and ID
    const message = await Message.findOneAndDelete({ _id: id, type });

    // If the message is not found
    if (!message) {
      console.log('Message not found!');
      return res.status(404).json({ error: "Message not found" });
    }

    console.log('Deleted message:', message);

    // After deleting, fetch the remaining messages of the same type
    const messages = await Message.find({ type });
    const defaultMsg = messages.find((m) => m.isDefault); // Find the default message if exists

    console.log('Remaining messages after delete:', messages);

    // Return the updated list of messages and the default message
    res.json({
      success: true,
      messages, 
      defaultMessage: defaultMsg?.text 
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Error deleting message", details: error });
  }
};
