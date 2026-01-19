const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Sticky = require('../../models/Sticky'); // Make sure the model path is correct

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stickyembed')
        .setDescription('🖼️ Enable sticky messages in Embed format (premium)')
        .addStringOption(opt => 
            opt.setName('description')
                .setDescription('Main content of the message (use \n for new line)')
                .setRequired(true))
        .addStringOption(opt => 
            opt.setName('title')
                .setDescription('Title at the top of the embed'))
        .addStringOption(opt => 
            opt.setName('color')
                .setDescription('Color Hex Code (Example: #ff0000 for Red)'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const deskripsi = interaction.options.getString('description');
        const judul = interaction.options.getString('title') || '📌 STICKY EMBED';
        const warna = interaction.options.getString('color') || '#00ff99';

        // Simple Hex color validation
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const finalColor = hexRegex.test(warna) ? color : '#00ff99';

        try {
            // We save the Embed object in JSON String form to MongoDB
            // so that later in messageCreate it can just be parsed or resent
            const embedData = {
                title: title,
                description: description,
                color: parseInt(finalColor.replace('#', ''), 16),
                footer: { text: `Server: ${interaction.guild.name}` },
                timestamp: new Date()
            };

            await Sticky.findOneAndUpdate(
                { guildId: interaction.guildId },
                { 
                    channelId: interaction.channelId,
                    content: JSON.stringify(embedData), // Save embed data as string
                    isEmbed: true,
                    lastMessageId: null 
                },
                { upsert: true, new: true }
            );

            // Preview for Admin
            const previewEmbed = new EmbedBuilder(embedData);

            return interaction.editReply({
                content: `✅ **Sticky Embed Successfully Activated!**`,
                embeds: [previewEmbed]
            });

        } catch (error) {
            console.error(error);
            return interaction.editReply('❌ An error occurred while saving to MongoDB.');
        }
    },
};