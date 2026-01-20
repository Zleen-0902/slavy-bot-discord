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
        name: Events.GuildMemberAdd,
        async execute(member) {
            // We only process if what comes in is a BOT
            if (!member.user.bot) return;

            const guild = member.guild;
            let inviter = 'System/Unknown';

            try {
                // Find out who invited the bot via Audit Logs
                const fetchedLogs = await guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.BotAdd,
                });
                const botLog = fetchedLogs.entries.first();

                if (botLog && botLog.target.id === member.id) {
                    inviter = botLog.executor;
                }
            } catch (error) {
                console.error('Failed to retrieve bot audit log:', error);
            }

            const logEmbed = new EmbedBuilder()
                .setTitle('🤖 New Bot Integrated')
                .setColor('#9b59b6')
                .setAuthor({ 
                    name: `Security Alert: External Integration`, 
                    iconURL: guild.iconURL({ dynamic: true }) 
                })
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                .setDescription(`A new bot entity has been successfully verified and added to the server..`)
                .addFields(
                    { name: '🤖 Bot Identity', value: `${member} (\`${member.user.tag}\`)`, inline: true },
                    { name: '🕵️ Authorized By', value: `${inviter} (\`${inviter.id || 'N/A'}\`)`, inline: true },
                    { name: '🆔 Bot ID', value: `\`${member.id}\``, inline: false }
                )
                .setFooter({ 
                    text: `Slavy Gatekeeper | Monitoring System ©️ 2026`, 
                    iconURL: guild.client.user.displayAvatarURL() 
                })
                .setTimestamp();

            await sendLog(guild, logEmbed);
        }
    }
];