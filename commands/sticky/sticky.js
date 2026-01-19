const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Sticky = require('../../models/Sticky');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stick')
        .setDescription('📌 Enabling sticky messages (default)')
        .addStringOption(opt => opt.setName('message').setDescription('Sticky message content').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const content = interaction.options.getString('message');
        const formattedContent = `━━━━━━━━━━━━━━━━━━━━━━━━━━\n📌 **STICKY MESSAGES**\n\n${content}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        try {
            // Find one and update (upsert: true means if it doesn't exist then create a new one)
            await Sticky.findOneAndUpdate(
                { guildId: interaction.guildId },
                { 
                    channelId: interaction.channelId,
                    content: formattedContent,
                    lastMessageId: null 
                },
                { upsert: true, new: true }
            );

            return interaction.editReply({
                content: `✅ **Success!** Creating a Sticky Message.\nChannel: <#${interaction.channelId}>`
            });
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ An error occurred in the Sticky Message');
        }
    },
};