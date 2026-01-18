const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Sticky = require('../../models/Sticky'); // Pastikan path model benar

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stickyembed')
        .setDescription('🖼️ Mengaktifkan pesan sticky dalam format Embed')
        .addStringOption(opt => 
            opt.setName('deskripsi')
                .setDescription('Isi utama pesan (gunakan \n untuk baris baru)')
                .setRequired(true))
        .addStringOption(opt => 
            opt.setName('judul')
                .setDescription('Judul di bagian atas embed'))
        .addStringOption(opt => 
            opt.setName('warna')
                .setDescription('Kode Hex Warna (Contoh: #ff0000 untuk Merah)'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const deskripsi = interaction.options.getString('deskripsi');
        const judul = interaction.options.getString('judul') || '📌 PENGUMUMAN';
        const warna = interaction.options.getString('warna') || '#00ff99';

        // Validasi warna Hex sederhana
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const finalColor = hexRegex.test(warna) ? warna : '#00ff99';

        try {
            // Kita simpan object Embed dalam bentuk JSON String ke MongoDB
            // agar nanti di messageCreate tinggal di-parse atau dikirim ulang
            const embedData = {
                title: judul,
                description: deskripsi,
                color: parseInt(finalColor.replace('#', ''), 16),
                footer: { text: `Server: ${interaction.guild.name}` },
                timestamp: new Date()
            };

            await Sticky.findOneAndUpdate(
                { guildId: interaction.guildId },
                { 
                    channelId: interaction.channelId,
                    content: JSON.stringify(embedData), // Simpan data embed sebagai string
                    isEmbed: true,
                    lastMessageId: null 
                },
                { upsert: true, new: true }
            );

            // Preview untuk Admin
            const previewEmbed = new EmbedBuilder(embedData);

            return interaction.editReply({
                content: `✅ **Sticky Embed Berhasil Diaktifkan!**`,
                embeds: [previewEmbed]
            });

        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ Terjadi kesalahan saat menyimpan ke MongoDB.');
        }
    },
};