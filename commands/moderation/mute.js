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
const ms = require('ms');
const { sendLog } = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('🔇 Temporarily mute members (Timeout)')
        .addUserOption(option => option.setName('target').setDescription('Members to be muted').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('Duration (example: 10m, 1h, 1d)').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for mute').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
    await interaction.deferReply();
        const target = interaction.options.getMember('target');
        const durationStr = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const durationMs = ms(durationStr);

        // Security Validation (Tanpa uiEmbed)
        if (!target) {
            return interaction.editReply({ 
                embeds: [new EmbedBuilder().setColor('#ff4757').setDescription('❌ Target not found!')] 
            });
        }
        
        // Duration Validation
        if (!durationMs || durationMs < 5000 || durationMs > 2419200000) {
            return interaction.editReply({ 
                embeds: [new EmbedBuilder().setColor('#ff4757').setDescription('❌ Invalid duration! Use format: `10m`, `1h`, `1d`. (Maximum 28 days)')] 
            });
        }

        if (!target.moderatable) {
            return interaction.editReply({ 
                embeds: [new EmbedBuilder().setColor('#ff4757').setDescription('❌ Slavy cant mute this user (Role too high).')] 
            });
        }

        const muteEmbed = new EmbedBuilder()
            .setTitle('🛡️ Moderation Action: MUTE (TIMEOUT)')
            .setColor('#f1c40f')
            .setThumbnail(target.user.displayAvatarURL())
            .addFields(
                { name: '👤 Target', value: `${target.user.tag}`, inline: true },
                { name: '🕒 Duration', value: `\`${durationStr}\``, inline: true },
                { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: false },
                { name: '📄 Reason', value: `\`\`\`${reason}\`\`\``, inline: false }
            )
            .setFooter({ text: `Slavy Security • Access Restricted` })
            .setTimestamp();

        // Try sending a DM
        try {
            await target.send({
                content: `🚨 You have been muted in **${interaction.guild.name}**`,
                embeds: [muteEmbed]
            });
        } catch (e) {
            muteEmbed.setFooter({ text: 'Slavy Security • DM Failed (Closed)' });
        }

        // Execution Timeout
        await target.timeout(durationMs, reason);
        await sendLog(interaction.guild, muteEmbed);

        await interaction.editReply({ embeds: [muteEmbed] });
    }
};