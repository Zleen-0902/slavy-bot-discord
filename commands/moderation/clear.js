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
        .setName('clear')
        .setDescription('🧹 Deleting a number of messages in this channel')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Number of messages to delete (1-100)')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true))
        .addUserOption(option => 
            option.setName('target')
                .setDescription('Only delete messages from specific users (optional)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        // Use ephemeral defer to prevent the bulkDelete from accidentally deleting the bot's interaction message
        await interaction.deferReply({ ephemeral: true });
        
        const amount = interaction.options.getInteger('amount');
        const target = interaction.options.getUser('target');
        
        try {
            // Fetch messages from the channel
            const messages = await interaction.channel.messages.fetch({ limit: amount });

            let filteredMessages;
            if (target) {
                // Filter messages only from specific target user
                filteredMessages = messages.filter(msg => msg.author.id === target.id);
            } else {
                filteredMessages = messages;
            }

            // Execute the bulk deletion
            const deleted = await interaction.channel.bulkDelete(filteredMessages, true);
            const deletedCount = deleted.size;

            const clearEmbed = new EmbedBuilder()
                .setTitle('🧹 Message Purge')
                .setColor('#3498db')
                .setDescription(`Successfully deleted **${deletedCount}** message${target ? ` from ${target.tag}` : ''}.`)
                .addFields(
                    { name: '📺 Channel', value: `<#${interaction.channel.id}>`, inline: true },
                    { name: '👮 Moderator', value: `${interaction.user.tag}`, inline: true }
                )
                .setFooter({ text: `Slavy Security System • Clear Message` })
                .setTimestamp();

            // Send report to server logging system
            await sendLog(interaction.guild, clearEmbed);

            // Notify the moderator (ephemeral ensures this doesn't get purged)
            await interaction.editReply({ embeds: [clearEmbed] }).catch(() => null);
            
            // Auto-delete reply after 5 seconds to keep interaction clean
            setTimeout(() => {
                interaction.deleteReply().catch(() => null);
            }, 5000);

        } catch (error) {
            console.error(error);
            return interaction.editReply({ 
                embeds: [
                    new EmbedBuilder()
                        .setColor('#ff4757')
                        .setDescription('❌ Failed to delete messages. Messages older than 14 days cannot be bulk deleted.')
                ] 
            }).catch(() => null);
        }
    }
};