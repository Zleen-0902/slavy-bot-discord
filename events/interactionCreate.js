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

const { Events, EmbedBuilder, MessageFlags } = require('discord.js');
const { sendLog } = require('../utils/logger');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`[ERROR] No commands match ${interaction.commandName}`);
            return;
        }

        // --- 1. PRO-LOGGING SYSTEM (Tracking Command Usage) ---
        if (interaction.member.permissions.has('ManageMessages') || interaction.member.permissions.has('Administrator')) {
            const cmdLogEmbed = new EmbedBuilder()
                .setTitle('🛰️ Command Execution Trace')
                .setColor('#34495e')
                .setAuthor({ 
                    name: interaction.user.tag, 
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
                })
                .setDescription(`Someone has executed a system command on the channel <#${interaction.channelId}>.`)
                .addFields(
                    { name: '💻 Command Used', value: `\`/${interaction.commandName}\``, inline: true },
                    { name: '👤 Executor', value: `${interaction.user}`, inline: true },
                    { name: '📂 Channel', value: `${interaction.channel.name}`, inline: true }
                )
                .setFooter({ text: 'Slavy Command Analytics' })
                .setTimestamp();

            await sendLog(interaction.guild, cmdLogEmbed).catch(() => null);
        }

        // --- 2. EXECUTION SYSTEM ---
        try {
            // We leave the respective command files that call deferReply()
            // to avoid the error "InteractionAlreadyReplied"
            await command.execute(interaction);
        } catch (error) {
            console.error(`[ERROR] An error occurred while running ${interaction.commandName}:`, error);
            
            const errorResponse = { 
                content: '⚠️ An internal error occurred while executing this command!', 
                flags: [MessageFlags.Ephemeral] 
            };

            // Smart Response: Check if the bot has responded before
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorResponse);
                } else {
                    await interaction.reply(errorResponse);
                }
            } catch (e) {
                // Leave it alone if the interaction has really expired so that the bot doesn't crash.
            }
        }
    },
};