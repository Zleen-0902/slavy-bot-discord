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
        name: Events.GuildMemberUpdate,
        async execute(oldMember, newMember) {
            const guild = newMember.guild;
            
            // Search for added or removed roles
            const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
            const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));

            if (addedRoles.size === 0 && removedRoles.size === 0) return;

            // Take Audit Logs to find the Executor
            let executor = 'System/Unknown';
            try {
                const fetchedLogs = await guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberRoleUpdate,
                });
                const roleLog = fetchedLogs.entries.first();

                if (roleLog && roleLog.target.id === newMember.id && (Date.now() - roleLog.createdAt < 5000)) {
                    executor = roleLog.executor.tag;
                }
            } catch (error) {
                console.error('Audit Log Error (Role):', error);
            }

            // --- LOGIC: ROLE ADDED ---
            if (addedRoles.size > 0) {
                const roleList = addedRoles.map(role => `${role}`).join(', ');
                const isBot = newMember.user.bot;

                const addEmbed = new EmbedBuilder()
                    .setTitle(isBot ? '🤖 Bot Permission Granted' : '👤 Member Role Added')
                    .setColor('#2ecc71')
                    .setAuthor({ 
                        name: newMember.user.tag, 
                        iconURL: newMember.user.displayAvatarURL({ dynamic: true }) 
                    })
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true, size: 256 }))
                    .setDescription(`New roles have been assigned to ${isBot ? 'this bot' : 'this member'}.`)
                    .addFields(
                        { name: '🎭 Role(s) Added', value: roleList, inline: false },
                        { name: '🕵️ Processed By', value: `\`${executor}\``, inline: true },
                        { name: '🆔 Target ID', value: `\`${newMember.id}\``, inline: true }
                    )
                    .setFooter({ 
                        text: `Slavy Security | Guardian System ©️ 2026`, 
                        iconURL: guild.client.user.displayAvatarURL() 
                    })
                    .setTimestamp();

                await sendLog(guild, addEmbed);
            }

            // --- LOGIC: ROLE REMOVED ---
            if (removedRoles.size > 0) {
                const roleList = removedRoles.map(role => `${role}`).join(', ');
                const isBot = newMember.user.bot;

                const removeEmbed = new EmbedBuilder()
                    .setTitle(isBot ? '🤖 Bot Permission Revoked' : '👤 Member Role Removed')
                    .setColor('#e67e22') 
                    .setAuthor({ 
                        name: newMember.user.tag, 
                        iconURL: newMember.user.displayAvatarURL({ dynamic: true }) 
                    })
                    .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true, size: 256 }))
                    .setDescription(`Roles have been stripped from ${isBot ? 'this bot' : 'this member'}.`)
                    .addFields(
                        { name: '🎭 Role(s) Removed', value: roleList, inline: false },
                        { name: '🕵️ Processed By', value: `\`${executor}\``, inline: true },
                        { name: '🆔 Target ID', value: `\`${newMember.id}\``, inline: true }
                    )
                    .setFooter({ 
                        text: `Slavy Security | Guardian System ©️ 2026`, 
                        iconURL: guild.client.user.displayAvatarURL() 
                    })
                    .setTimestamp();

                await sendLog(guild, removeEmbed);
            }
        }
    }
];