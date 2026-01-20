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
const Warning = require('../../models/Warning');
const { sendLog } = require('../../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('🛡️ Remove warning points from members')
        .addUserOption(option => option.setName('target').setDescription('Members who will be unwarned').setRequired(true))
        .addStringOption(option => 
            option.setName('mode')
                .setDescription('Select deletion method')
                .setRequired(true)
                .addChoices(
                    { name: 'Remove Latest (Delete Latest)', value: 'latest' },
                    { name: 'Clear All (Delete All)', value: 'all' }
                ))
        .addStringOption(option => option.setName('reason').setDescription('Reason for deletion').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
    await interaction.deferReply();
        const target = interaction.options.getUser('target');
        const mode = interaction.options.getString('mode');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const guildId = interaction.guild.id;

        try {
            const warnData = await Warning.findOne({ guildId, userId: target.id });

            if (!warnData || warnData.warns.length === 0) {
                return interaction.editReply({ 
                    embeds: [
                        new EmbedBuilder()
                            .setColor('#ff4757')
                            .setDescription('❌ This user has no warning history in the database.')
                    ] 
                });
            }

            let description = "";

            if (mode === 'latest') {
                // Remove one last warning
                warnData.warns.pop();
                description = `Successfully removed the latest warning for **${target.tag}**.`;
            } else if (mode === 'all') {
                // Remove all array warns
                warnData.warns = [];
                description = `Successfully cleared all warnings for **${target.tag}**.`;
            }

            await warnData.save();

            // Luxury Embed Unwarn Results
            const unwarnEmbed = new EmbedBuilder()
                .setTitle('🛡️ Moderation Action: UNWARNED')
                .setColor('#2ecc71')
                .setThumbnail(target.displayAvatarURL())
                .addFields(
                    { name: '👤 Target', value: `${target.tag}`, inline: true },
                    { name: '🔢 Remaining Warns', value: `**${warnData.warns.length}**`, inline: true },
                    { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: false },
                    { name: '📄 Reason', value: `\`\`\`${reason}\`\`\``, inline: false }
                )
                .setDescription(description)
                .setFooter({ text: `Slavy Security System • Database Updated` })
                .setTimestamp();

            // Send report to channel log
            await sendLog(interaction.guild, unwarnEmbed);

            // Notify the user via DM
            try {
                await target.send({
                    content: `✨ Your warning status in **${interaction.guild.name}** has been updated.`,
                    embeds: [unwarnEmbed]
                });
            } catch (err) {
                unwarnEmbed.setFooter({ text: 'Slavy Security System • DM Failed (Closed)' });
            }

            await interaction.editReply({ embeds: [unwarnEmbed] });

        } catch (error) {
            console.error(error);
            interaction.editReply({ 
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff4757')
                        .setDescription('❌ An error occurred while updating the database.')
                ] 
            });
        }
    }
};