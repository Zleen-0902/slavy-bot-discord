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
const { sendLog } = require('../../utils/logger'); // Connecting the Logger

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('🚫 Banned user for clear reasons')
        .addUserOption(option => option.setName('target').setDescription('Members who will be banned').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for ban').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
    await interaction.deferReply();
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const moderator = interaction.user;

        // Security Validation
        if (!target) {
            return interaction.editReply({ 
                embeds: [new EmbedBuilder().setColor('#ff4757').setDescription('❌ Target not found on this server!')] 
            });
        }
        
        if (!target.bannable) {
            return interaction.editReply({ 
                embeds: [new EmbedBuilder().setColor('#ff4757').setDescription('❌ Slavy cant ban this user (their Role is higher/same).')] 
            });
        }

        // Luxury Embed View
        const banEmbed = new EmbedBuilder()
            .setTitle('🛡️ Moderation Action: BAN SYSTEM')
            .setColor('#ff0000')
            .setThumbnail(target.user.displayAvatarURL())
            .addFields(
                { name: '👤 Target', value: `${target.user.tag}\n(${target.id})`, inline: true },
                { name: '👮 Moderator', value: `${moderator.tag}`, inline: true },
                { name: '📄 Reason', value: `\`\`\`${reason}\`\`\``, inline: false }
            )
            .setFooter({ text: `Slavy Security System • ${interaction.guild.name}` })
            .setTimestamp();

        let dmStatus = "✅ DM Sent";

        // Try to send DM before Ban
        try {
            await target.send({
                content: `🚨 You have been banned from **${interaction.guild.name}**`,
                embeds: [banEmbed]
            });
        } catch (e) {
            dmStatus = "❌ DM Failed (User closed DMs)";
        }

        // Ban Execution
        await target.ban({ reason: `Banned by ${moderator.tag}: ${reason}` });

        // Update footer to show DM status
        banEmbed.setFooter({ text: `Slavy Security System • ${dmStatus}` });

        // Send reports to the configured log channel
        await sendLog(interaction.guild, banEmbed);

        await interaction.editReply({ embeds: [banEmbed] });
    }
};