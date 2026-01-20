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

const { EmbedBuilder, Events, ChannelType, AuditLogEvent } = require('discord.js');
const { sendLog } = require('../utils/logger');

/**
 * Helper function to get Icon and Name of channel type dynamically
 */
function getChannelInfo(type) {
    switch (type) {
        case ChannelType.GuildVoice:
            return { icon: '🔊', name: 'Voice Chat' };
        case ChannelType.GuildStageVoice:
            return { icon: '🎙️', name: 'Stage Chat' };
        case ChannelType.GuildForum:
            return { icon: '📄', name: 'Forum Post' };
        case ChannelType.PublicThread:
        case ChannelType.PrivateThread:
            return { icon: '🧵', name: 'Thread' };
        default:
            return { icon: '💬', name: 'Text Channel' };
    }
}

module.exports = [
    // --- EVENT: MESSAGE UPDATE (EDIT) ---
    {
        name: Events.MessageUpdate,
        async execute(oldMessage, newMessage) {
            // Proteksi: Pastikan pesan memiliki author dan bukan bot
            if (!oldMessage.guild || !oldMessage.author || oldMessage.author.bot) return;
            if (oldMessage.content === newMessage.content) return;

            const chInfo = getChannelInfo(oldMessage.channel.type);

            const logEmbed = new EmbedBuilder()
                .setTitle(`📝 Message Edited — ${chInfo.name}`)
                .setColor('#3498db')
                .setAuthor({ 
                    name: oldMessage.author.tag, 
                    iconURL: oldMessage.author.displayAvatarURL({ dynamic: true }) 
                })
                .setThumbnail(oldMessage.guild.iconURL({ dynamic: true }))
                .setDescription(`A message was modified in ${oldMessage.channel} by ${oldMessage.author}.`)
                .addFields(
                    { name: '⬅️ Before (Old)', value: `\`\`\`${oldMessage.content?.slice(0, 1000) || '*(No text content)*'}\`\`\``, inline: false },
                    { name: '➡️ After (New)', value: `\`\`\`${newMessage.content?.slice(0, 1000) || '*(No text content)*'}\`\`\``, inline: false },
                    { name: '📍 Location', value: `${chInfo.icon} <#${oldMessage.channel.id}>\nID: \`${oldMessage.channel.id}\``, inline: true },
                    { name: '🔗 Jump to Message', value: `[Click Here](${newMessage.url})`, inline: true }
                )
                .setFooter({ 
                    text: `Slavy Analytics | User ID: ${oldMessage.author.id}`, 
                    iconURL: oldMessage.client.user.displayAvatarURL() 
                })
                .setTimestamp();

            await sendLog(oldMessage.guild, logEmbed).catch(() => null);
        }
    },

    // --- EVENT: MESSAGE DELETE ---
    {
        name: Events.MessageDelete,
        async execute(message) {
            // Protection: If the message is not cached or the author does not exist
            if (!message.guild || !message.author || message.author.bot) return;

            let executorInfo = 'Self / System';
            try {
                // Add a small delay to give Discord time to record it in the Audit Log.
                await new Promise(resolve => setTimeout(resolve, 1000));

                const fetchedLogs = await message.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MessageDelete,
                });
                const deletionLog = fetchedLogs.entries.first();

                if (deletionLog) {
                    const { target, executor, createdTimestamp } = deletionLog;
                    // Make sure the target is the author of the message and the log is fresh (less than 10 seconds)
                    if (target && target.id === message.author.id && (Date.now() - createdTimestamp) < 10000) {
                        executorInfo = executor ? `${executor.tag} (\`${executor.id}\`)` : 'Unknown';
                    }
                }
            } catch (error) {
                console.error('Failed to fetch audit logs for message delete:', error.message);
            }

            const chInfo = getChannelInfo(message.channel.type);

            const logEmbed = new EmbedBuilder()
                .setTitle(`🗑️ Message Deleted — ${chInfo.name}`)
                .setColor('#e74c3c')
                .setAuthor({ 
                    name: message.author.tag, 
                    iconURL: message.author.displayAvatarURL({ dynamic: true }) 
                })
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setDescription(`A message was removed in ${message.channel}.`)
                .addFields(
                    { name: '📝 Original Content', value: `\`\`\`${message.content?.slice(0, 1000) || '*(No text content)*'}\`\`\``, inline: false },
                    { name: '👤 Author', value: `<@${message.author.id}> (\`${message.author.id}\`)`, inline: true },
                    { name: '🕵️ Deleted By', value: executorInfo, inline: true },
                    { name: '📍 Location', value: `${chInfo.icon} <#${message.channel.id}>`, inline: true }
                )
                .setFooter({ 
                    text: `Slavy Security System | Message ID: ${message.id}`, 
                    iconURL: message.client.user.displayAvatarURL() 
                })
                .setTimestamp();

            await sendLog(message.guild, logEmbed).catch(() => null);
        }
    }
];