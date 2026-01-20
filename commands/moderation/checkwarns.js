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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkwarns')
        .setDescription('🔍 View a members list of warnings')
        .addUserOption(option => option.setName('target').setDescription('Members who want to be checked').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
    await interaction.deferReply();
        const target = interaction.options.getUser('target');
        const guildId = interaction.guild.id;

        try {
            const warnData = await Warning.findOne({ guildId, userId: target.id });

            // If there is no data or the array warns empty
            if (!warnData || warnData.warns.length === 0) {
                return interaction.editReply({ 
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('🔍 Violation Information')
                            .setColor('#3498db')
                            .setThumbnail(target.displayAvatarURL())
                            .setDescription(`**${target.tag}** is clean from any record of violations.`)
                    ] 
                });
            }

            // Limit the display if there are too many
            const recentWarns = warnData.warns.slice(-10).reverse(); 
            
            const listEmbed = new EmbedBuilder()
                .setTitle(`🛡️ Warning History: ${target.username}`)
                .setColor('#3498db')
                .setThumbnail(target.displayAvatarURL())
                .setDescription(`Total found **${warnData.warns.length}** warning(s) for this user.`)
                .setFooter({ text: `Slavy Security • Only displays the 10 most recent records` })
                .setTimestamp();

            // Mapping warn data into embed field
            recentWarns.forEach((w, index) => {
                listEmbed.addFields({
                    name: `📌 Warn #${warnData.warns.length - index}`,
                    value: `**Reason:** ${w.reason}\n**Moderator:** <@${w.moderatorId}>\n**Date:** <t:${Math.floor(w.timestamp / 1000)}:R>`,
                    inline: false
                });
            });

            await interaction.editReply({ embeds: [listEmbed] });

        } catch (error) {
            console.error(error);
            interaction.editReply({ 
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff4757')
                        .setDescription('❌ An error occurred while retrieving data from MongoDB.')
                ] 
            });
        }
    }
};