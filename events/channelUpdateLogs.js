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

const { EmbedBuilder, Events, AuditLogEvent, ChannelType } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = [
    {
        name: Events.ChannelUpdate,
        async execute(oldChannel, newChannel) {
            const guild = newChannel.guild;
            const logEmbed = new EmbedBuilder()
                .setFooter({ text: 'Slavy Infrastructure Monitor', iconURL: guild.client.user.displayAvatarURL() })
                .setTimestamp();

            let description = [];
            let executor = 'System/Unknown';

            // 1. Take Audit Log to find the culprit
            try {
                const fetchedLogs = await guild.fetchAuditLogs({ limit: 1 });
                const entry = fetchedLogs.entries.first();
                if (entry && (Date.now() - entry.createdAt < 5000)) {
                    executor = entry.executor.tag;
                }
            } catch (err) { console.error('Audit Log Error (Channel):', err); }

            // 2. Name Change Detection
            if (oldChannel.name !== newChannel.name) {
                description.push(`**🏷️ Name Changed:**\n\`${oldChannel.name}\` ➔ \`${newChannel.name}\``);
            }

            // 3. Topic Change Detection (Text/Forum/Announce)
            if (oldChannel.topic !== newChannel.topic) {
                description.push(`**📝 Topic Modified:**\n*From:* ${oldChannel.topic || 'None'}\n*To:* ${newChannel.topic || 'None'}`);
            }

            // 4. Bitrate Change Detection (Voice/Stage)
            if (oldChannel.bitrate !== newChannel.bitrate) {
                description.push(`**📶 Bitrate Updated:** \`${oldChannel.bitrate / 1000}kbps\` ➔ \`${newChannel.bitrate / 1000}kbps\``);
            }

            // 5. Permission Change Detection Overwrites
            const oldOverwrites = oldChannel.permissionOverwrites.cache;
            const newOverwrites = newChannel.permissionOverwrites.cache;

            if (oldOverwrites.size !== newOverwrites.size) {
                const removed = oldOverwrites.filter(ow => !newOverwrites.has(ow.id));
                const added = newOverwrites.filter(ow => !oldOverwrites.has(ow.id));
                
                if (removed.size > 0) description.push(`**⚠️ Permission Removed:** For ID \`${removed.first().id}\``);
                if (added.size > 0) description.push(`**✅ Permission Added:** For ID \`${added.first().id}\``);
            }

            if (description.length === 0) return; // If there are no relevant changes (e.g. only channel position)

            logEmbed
                .setTitle(`🛠️ Channel Infrastructure Updated`)
                .setColor('#f39c12')
                .setAuthor({ name: `Target: #${newChannel.name}`, iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(description.join('\n\n'))
                .addFields(
                    { name: '📂 Channel Type', value: `\`${ChannelType[newChannel.type]}\``, inline: true },
                    { name: '🕵️ Executor', value: `\`${executor}\``, inline: true },
                    { name: '🆔 Channel ID', value: `\`${newChannel.id}\``, inline: true }
                );

            await sendLog(guild, logEmbed);
        }
    }
];