const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Sticky = require('../../models/Sticky');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unstick')
        .setDescription('🗑️ Menghapus sticky message (MongoDB)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const deleted = await Sticky.findOneAndDelete({ guildId: interaction.guildId });

        if (!deleted) {
            return interaction.editReply('❌ Tidak ada sticky aktif di server ini.');
        }

        return interaction.editReply('🗑️ Sticky message berhasil dihapus dari MongoDB.');
    },
};