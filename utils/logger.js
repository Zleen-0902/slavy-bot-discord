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
const GuildConfig = require('../models/GuildConfig');

async function sendLog(guild, embed) {
    // Finding log configuration by guild ID from MongoDB
    const config = await GuildConfig.findOne({ guildId: guild.id });
    if (!config || !config.logChannelId) return;

    const logChannel = guild.channels.cache.get(config.logChannelId);
    if (logChannel) {
        // Sending embeds to pre-set channels
        logChannel.send({ embeds: [embed] }).catch(console.error);
    }
}

module.exports = { sendLog };