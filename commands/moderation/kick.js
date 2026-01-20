/*
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⣿⠀⠀⠀⢠⣾⣧⣤⡖⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⠋⠀⠉⠀⢄⣸⣿⣿⣿⣿⣿⣥⡤⢶⣿⣦⣀⡀
⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⡆⠀⠀⠀⣙⣛⣿⣿⣿⣿⡏⠀⠀⣀⣿⣿⣿⡟
⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⠷⣦⣤⣤⣬⣽⣿⣿⣿⣿⣿⣿⣿⣟⠛⠿⠋⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⠋⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⡆⠀⠀
⠀⠀⠀⠀⣠⣶⣶⣶⣿⣦⡀⠘⣿⣿⣿⣿⣿⣿⣿⣿⠿⠋⠈⢹⡏⠁⠀⠀
⠀⠀⠀⢀⣿⡏⠉⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡆⠀⢀⣿⡇⠀⠀⠀
⠀⠀⠀⢸⣿⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣟⡘⣿⣿⣃⠀⠀⠀
⣴⣷⣀⣸⣿⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⠹⣿⣯⣤⣾⠏⠉⠉⠉⠙⠢⠀
⠈⠙⢿⣿⡟⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣄⠛⠉⢩⣷⣴⡆⠀⠀⠀⠀⠀
⠀⠀⠀⠋⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣀⡠⠋⠈⢿⣇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠿⠿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀

--------------------------------------------
👑 Owner    : Enzzyx
📡 Discord  : https://discord.gg/QYVcWZbBp
🛠️ Studio   : Hazz Wave Studio
✅ Verified | 🧩 Flexible | ⚙️ Stable
--------------------------------------------
> © 2026 Enzzyx || Hazz Wave Studio || Slavy
--------------------------------------------
*/

const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { sendLog } = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('🚷 Kick members from this server')
        .addUserOption(option => option.setName('target').setDescription('Members who will be kicked').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for kick').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {
    await interaction.deferReply();
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const moderator = interaction.user;

        // Security Validation
        if (!target) {
            return interaction.editReply({ 
                embeds: [new EmbedBuilder().setColor('#ff4757').setDescription('❌ Target not found!')] 
            });
        }
        
        if (!target.kickable) {
            return interaction.editReply({ 
                embeds: [new EmbedBuilder().setColor('#ff4757').setDescription('❌ Slavy cant kick this user (their Role is higher or Slavy lacks permission).')] 
            });
        }

        if (target.id === interaction.user.id) {
            return interaction.editReply({ 
                embeds: [new EmbedBuilder().setColor('#ff4757').setDescription('❌ You cant kick yourself!')] 
            });
        }

        // Luxury Embed View
        const kickEmbed = new EmbedBuilder()
            .setTitle('🛡️ Moderation Action: KICK SYSTEM')
            .setColor('#e67e22')
            .setThumbnail(target.user.displayAvatarURL())
            .addFields(
                { name: '👤 Target', value: `${target.user.tag}\n(${target.id})`, inline: true },
                { name: '👮 Moderator', value: `${moderator.tag}`, inline: true },
                { name: '📄 Reason', value: `\`\`\`${reason}\`\`\``, inline: false }
            )
            .setFooter({ text: `Slavy Security System • Processed` })
            .setTimestamp();

        let dmStatus = "✅ DM Sent";

        // Try sending DM before Kick
        try {
            await target.send({
                content: `⚠️ You have been kicked from **${interaction.guild.name}**`,
                embeds: [kickEmbed]
            });
        } catch (e) {
            dmStatus = "❌ DM Failed (DMs Closed)";
        }

        // Kick Execution
        await target.kick(`Kicked by ${moderator.tag}: ${reason}`);

        // Update footer with DM status
        kickEmbed.setFooter({ text: `Slavy Security System • ${dmStatus}` });

        // Send report to channel log
        await sendLog(interaction.guild, kickEmbed);

        await interaction.editReply({ embeds: [kickEmbed] });
    }
};