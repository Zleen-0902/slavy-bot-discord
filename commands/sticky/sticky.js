const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Sticky = require('../../models/Sticky');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stick')
        .setDescription('📌 Mengaktifkan pesan sticky via MongoDB')
        .addStringOption(opt => opt.setName('pesan').setDescription('Isi pesan sticky').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const content = interaction.options.getString('pesan');
        const formattedContent = `━━━━━━━━━━━━━━━━━━━━━━━━━━\n📌 **PENGUMUMAN PENTING**\n\n${content}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        try {
            // Find one and update (upsert: true artinya kalau belum ada maka buat baru)
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
                content: `✅ **Berhasil!** Data disimpan di MongoDB Atlas.\nChannel: <#${interaction.channelId}>`
            });
        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Terjadi kesalahan pada database MongoDB.');
        }
    },
};