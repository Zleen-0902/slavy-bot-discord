const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Sticky = require('../../models/Sticky');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unstick')
        .setDescription('🗑️ Deleting sticky messages.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const deleted = await Sticky.findOneAndDelete({ guildId: interaction.guildId });

        if (!deleted) {
            return interaction.editReply('❌ There are no active sticky messages on this server.');
        }

        return interaction.editReply('🗑️ Sticky message successfully deleted.');
    },
};