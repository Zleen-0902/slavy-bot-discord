/*
--------------------------------------------
👑 Owner    : Enzzyx
📡 Discord  : https://discord.gg/QYVcWZbBp
🛠️ Studio   : Hazz Wave Studio
✅ Verified | 🧩 Flexible | ⚙️ Stable
--------------------------------------------
> © 2026 Enzzyx || Hazz Wave Studio || Slavy
--------------------------------------------
*/
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    afk: {
        is_afk: { type: Boolean, default: false },
        reason: { type: String, default: '' },
        time: { type: Number, default: 0 }
    },
    reminders: [{
        content: String,
        time: Number,
        createdAt: { type: Number, default: Date.now }
    }]
});

module.exports = mongoose.model('User', userSchema);