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

const { EmbedBuilder, Events, ChannelType } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        const { member, guild } = newState;
        if (member.user.bot) return;

        const logEmbed = new EmbedBuilder()
            .setAuthor({ 
                name: member.user.tag, 
                iconURL: member.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTimestamp()
            .setFooter({ 
                text: `Slavy Voice Monitor | User ID: ${member.id}`, 
                iconURL: newState.client.user.displayAvatarURL() 
            });

        // 1. JOIN (Enter Voice/Stage)
        if (!oldState.channelId && newState.channelId) {
            const isStage = newState.channel.type === ChannelType.GuildStageVoice;
            
            logEmbed
                .setTitle(isStage ? '🎙️ Joined Stage Channel' : '🔊 Joined Voice Channel')
                .setColor('#2ecc71')
                .setDescription(`${member} has joined the conversation.`)
                .addFields(
                    { name: '📍 Channel', value: `${newState.channel.name}`, inline: true },
                    { name: '🆔 Channel ID', value: `\`${newState.channelId}\``, inline: true }
                );

            return await sendLog(guild, logEmbed);
        }

        // 2. LEAVE (Exit Voice/Stage)
        if (oldState.channelId && !newState.channelId) {
            const isStage = oldState.channel.type === ChannelType.GuildStageVoice;

            logEmbed
                .setTitle(isStage ? '🔇 Left Stage Channel' : '🔇 Left Voice Channel')
                .setColor('#e74c3c')
                .setDescription(`${member} has disconnected from the channel.`)
                .addFields(
                    { name: '📍 Previous Channel', value: `${oldState.channel.name}`, inline: true },
                    { name: '🆔 Channel ID', value: `\`${oldState.channelId}\``, inline: true }
                );

            return await sendLog(guild, logEmbed);
        }

        // 3. MOVE (Switch between Channels)
        if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
            logEmbed
                .setTitle('🔄 Switched Voice Channel')
                .setColor('#f1c40f')
                .setDescription(`${member} moved to a different room.`)
                .addFields(
                    { name: '⬅️ From', value: `${oldState.channel.name}`, inline: true },
                    { name: '➡️ To', value: `${newState.channel.name}`, inline: true },
                    { name: '🆔 New ID', value: `\`${newState.channelId}\``, inline: false }
                );

            return await sendLog(guild, logEmbed);
        }
    }
};