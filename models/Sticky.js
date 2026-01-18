const mongoose = require('mongoose');

const StickySchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    channelId: { type: String, required: true },
    content: { type: String, required: true },
    isEmbed: { type: Boolean, default: false },
    lastMessageId: { type: String, default: null }
});

module.exports = mongoose.model('Sticky', StickySchema);