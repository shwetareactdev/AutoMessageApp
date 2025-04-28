
const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel'); // ✅ correct
const { ObjectId } = require('mongodb');

// GET all messages for a specific call type (e.g., incoming, missed, outgoing)
router.get('/:type', async (req, res) => {
  const { type } = req.params;
  try {
    const messages = await Message.find({ type });
    const defaultMsg = await Message.findOne({ type, isDefault: true });
    res.json({ messages, defaultMessage: defaultMsg?.text });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages', details: err });
  }
});

// ADD message
router.post('/:type', async (req, res) => {
  const { type } = req.params;
  const { text } = req.body;
  const newMessage = new Message({ text, type });
  try {
    await newMessage.save();
    const messages = await Message.find({ type });
    res.json({ messages });
  } catch (e) {
    res.status(500).json({ error: 'Error adding message', details: e });
  }
});

// SET default message for a specific call type
router.put('/:type/default', async (req, res) => {
  const { type } = req.params;
  const { id } = req.body;
  try {
    // Set all other messages to non-default
    await Message.updateMany({ type }, { isDefault: false });

    // Set the specified message as default
    await Message.findByIdAndUpdate(id, { isDefault: true });

    // Fetch the updated list of messages and the default one
    const messages = await Message.find({ type });
    const defaultMsg = messages.find((m) => m.isDefault);
    res.json({ messages, defaultMessage: defaultMsg?.text });
  } catch (e) {
    res.status(500).json({ error: 'Error setting default message', details: e });
  }
});

// DELETE message by ID for a specific call type
router.delete('/:type/:id', async (req, res) => {
  const { type, id } = req.params;

  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    // Delete the specified message
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Fetch the updated list of messages after deletion
    const messages = await Message.find({ type });
    const defaultMsg = messages.find((m) => m.isDefault);

    res.json({
      success: true,
      messages,
      defaultMessage: defaultMsg?.text,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting message', details: error });
  }
});

module.exports = router;
