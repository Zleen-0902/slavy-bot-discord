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
        .setName('warn')
        .setDescription('‼️ Provide warnings to members')
        .addUserOption(option => option.setName('target').setDescription('Member who will be warned').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        await interaction.deferReply();
        
        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const guildId = interaction.guild.id;
        const targetMember = await interaction.guild.members.fetch(target.id).catch(() => null);

        // Security Validation: Anti-Bot
        if (target.bot) {
            return interaction.editReply({ 
                embeds: [new EmbedBuilder().setColor('#ff4757').setDescription('❌ You cannot give a warning to a bot!')] 
            });
        }
        
        // Security Validation: Anti-Self
        if (target.id === interaction.user.id) {
            return interaction.editReply({ 
                embeds: [new EmbedBuilder().setColor('#ff4757').setDescription('❌ You cannot warn yourself!')] 
            });
        }

        // Security Validation: Role Hierarchy
        if (targetMember && targetMember.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.editReply({ 
                embeds: [new EmbedBuilder().setColor('#ff4757').setDescription('❌ You cannot warn this member because they have a higher or equal role position!')] 
            });
        }

        try {
            // Look for the user warning data in MongoDB
            let warnData = await Warning.findOne({ guildId, userId: target.id });

            if (!warnData) {
                warnData = new Warning({
                    guildId,
                    userId: target.id,
                    warns: []
                });
            }

            // Add new warning entry
            warnData.warns.push({
                moderatorId: interaction.user.id,
                reason: reason,
                timestamp: Date.now()
            });

            await warnData.save();

            const warnCount = warnData.warns.length;

            // Luxury Embed Construction
            const warnEmbed = new EmbedBuilder()
                .setTitle('🛡️ Moderation Action: WARNING SYSTEM')
                .setColor('#f39c12')
                .setThumbnail(target.displayAvatarURL())
                .addFields(
                    { name: '👤 Target', value: `${target.tag}`, inline: true },
                    { name: '🔢 Total Warns', value: `**${warnCount}**`, inline: true },
                    { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: false },
                    { name: '📄 Reason', value: `\`\`\`${reason}\`\`\``, inline: false }
                )
                .setFooter({ text: `Slavy Security System • Warning Logged` })
                .setTimestamp();

            // Send report to the configured logging channel
            await sendLog(interaction.guild, warnEmbed);

            // Attempt to notify the target via Direct Message
            try {
                await target.send({
                    content: `⚠️ You have received a warning in **${interaction.guild.name}**`,
                    embeds: [warnEmbed]
                });
            } catch (err) {
                // If DM fails, we update the footer but continue the process
                warnEmbed.setFooter({ text: 'Slavy Security System • DM Failed (Closed)' });
            }

            await interaction.editReply({ embeds: [warnEmbed] });

        } catch (error) {
            console.error(error);
            interaction.editReply({ 
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff4757')
                        .setDescription('❌ An error occurred while accessing the database.')
                ] 
            });
        }
    }
};