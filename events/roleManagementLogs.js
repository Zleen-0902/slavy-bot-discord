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

const { EmbedBuilder, Events, AuditLogEvent, PermissionsBitField } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = [
    // 1. EVENT: ROLE CREATE
    {
        name: Events.GuildRoleCreate,
        async execute(role) {
            const guild = role.guild;
            let executor = 'System/Unknown';

            try {
                const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleCreate });
                const roleLog = fetchedLogs.entries.first();
                if (roleLog && roleLog.target.id === role.id && (Date.now() - roleLog.createdAt < 5000)) {
                    executor = roleLog.executor.tag;
                }
            } catch (err) { console.error('Audit Log Error (Role Create):', err); }

            const logEmbed = new EmbedBuilder()
                .setTitle('✨ New Role Deployment')
                .setColor(role.hexColor === '#000000' ? '#2ecc71' : role.hexColor)
                .setAuthor({ name: `Infrastructure: ${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`A new role identity has been successfully created and registered into the system.`)
                .addFields(
                    { name: '🎭 Role Name', value: `${role} (\`${role.name}\`)`, inline: true },
                    { name: '🎨 Color Hex', value: `\`${role.hexColor.toUpperCase()}\``, inline: true },
                    { name: '🕵️ Creator', value: `\`${executor}\``, inline: true }
                )
                .setFooter({ text: 'Slavy Identity Management', iconURL: guild.client.user.displayAvatarURL() })
                .setTimestamp();

            await sendLog(guild, logEmbed);
        }
    },

    // 2. EVENT: ROLE UPDATE (Name, Color, Permissions)
    {
        name: Events.GuildRoleUpdate,
        async execute(oldRole, newRole) {
            const guild = newRole.guild;
            const changes = [];
            let executor = 'System/Unknown';

            // Get Audit Logs to find the perpetrator of the change
            try {
                const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleUpdate });
                const updateLog = fetchedLogs.entries.first();
                if (updateLog && updateLog.target.id === newRole.id && (Date.now() - updateLog.createdAt < 5000)) {
                    executor = updateLog.executor.tag;
                }
            } catch (err) { console.error('Audit Log Error (Role Update):', err); }

            // Name Change Detection
            if (oldRole.name !== newRole.name) {
                changes.push(`**🏷️ Name Change:**\n\`${oldRole.name}\` ➔ \`${newRole.name}\``);
            }

            // Color Change Detection (As per your request: detected & notified)
            if (oldRole.hexColor !== newRole.hexColor) {
                changes.push(`**🎨 Color Shift:**\n\`${oldRole.hexColor.toUpperCase()}\` ➔ \`${newRole.hexColor.toUpperCase()}\``);
            }

            // Permission Change Detection
            if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
                const oldPerms = new PermissionsBitField(oldRole.permissions.bitfield).toArray();
                const newPerms = new PermissionsBitField(newRole.permissions.bitfield).toArray();
                
                const added = newPerms.filter(p => !oldPerms.includes(p));
                const removed = oldPerms.filter(p => !newPerms.includes(p));

                if (added.length > 0) changes.push(`**✅ Permissions Added:**\n\`${added.join('`, `')}\``);
                if (removed.length > 0) changes.push(`**❌ Permissions Revoked:**\n\`${removed.join('`, `')}\``);
            }

            if (changes.length === 0) return;

            const logEmbed = new EmbedBuilder()
                .setTitle('⚙️ Role Configuration Updated')
                .setColor('#f1c40f')
                .setAuthor({ name: `Target Role: ${newRole.name}`, iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(changes.join('\n\n'))
                .addFields(
                    { name: '🕵️ Modified By', value: `\`${executor}\``, inline: true },
                    { name: '🆔 Role ID', value: `\`${newRole.id}\``, inline: true }
                )
                .setFooter({ text: 'Slavy Security Analytics', iconURL: guild.client.user.displayAvatarURL() })
                .setTimestamp();

            await sendLog(guild, logEmbed);
        }
    },

    // 3. EVENT: ROLE DELETE
    {
        name: Events.GuildRoleDelete,
        async execute(role) {
            const guild = role.guild;
            const logEmbed = new EmbedBuilder()
                .setTitle('🚨 Role Permanently Removed')
                .setColor('#e74c3c')
                .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
                .setDescription(`Role **${role.name}** has been permanently removed from the server infrastructure.`)
                .addFields({ name: '🆔 Former ID', value: `\`${role.id}\``, inline: true })
                .setFooter({ text: 'Slavy Security System' })
                .setTimestamp();

            await sendLog(guild, logEmbed);
        }
    }
];