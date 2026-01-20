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
const { EmbedBuilder, Events, AuditLogEvent } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = [
    {
        name: Events.ChannelCreate,
        async execute(channel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('🆕 New Channel Created')
                .setColor('#2ecc71')
                .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL() })
                .setDescription(`A new channel has been deployed: ${channel}`)
                .addFields(
                    { name: '🏷️ Name', value: `\`${channel.name}\``, inline: true },
                    { name: '🆔 ID', value: `\`${channel.id}\``, inline: true }
                )
                .setTimestamp();
            await sendLog(channel.guild, logEmbed);
        }
    },
    {
        name: Events.ChannelDelete,
        async execute(channel) {
            const logEmbed = new EmbedBuilder()
                .setTitle('🚨 Channel Permanently Removed')
                .setColor('#c0392b')
                .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL() })
                .setDescription(`The channel **#${channel.name}** was deleted from the infrastructure.`)
                .addFields({ name: '🆔 Former ID', value: `\`${channel.id}\``, inline: true })
                .setTimestamp();
            await sendLog(channel.guild, logEmbed);
        }
    }
];