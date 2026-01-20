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

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const Sticky = require('../../models/Sticky'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stickyembed')
        .setDescription('💭 Enable sticky messages in Embed format (premium)')
        .addStringOption(opt => 
            opt.setName('description')
                .setDescription('Main content of the message (use \\n for new line)')
                .setRequired(true))
        .addStringOption(opt => 
            opt.setName('title')
                .setDescription('Title at the top of the embed'))
        .addStringOption(opt => 
            opt.setName('thumbnail')
                .setDescription('URL Image for thumbnail (optional)'))
        .addStringOption(opt => 
            opt.setName('color')
                .setDescription('Color Hex Code (Example: #ff0000 for Red)'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), 

    async execute(interaction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const description = interaction.options.getString('description').replace(/\\n/g, '\n');
        const title = interaction.options.getString('title') || '📌 STICKY EMBED';
        const thumbnail = interaction.options.getString('thumbnail');
        const color = interaction.options.getString('color') || '#00ff99';

        // Simple Hex color validation
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const finalColor = hexRegex.test(color) ? color : '#00ff99';

        try {
            // Embed data preparation
            const embedData = {
                title: title,
                description: description,
                color: parseInt(finalColor.replace('#', ''), 16),
                footer: { text: `Server: ${interaction.guild.name}` },
                timestamp: new Date()
            };

            // If there is a thumbnail, insert it into the object
            if (thumbnail && thumbnail.startsWith('http')) {
                embedData.thumbnail = { url: thumbnail };
            }

            await Sticky.findOneAndUpdate(
                { guildId: interaction.guildId },
                { 
                    channelId: interaction.channelId,
                    content: JSON.stringify(embedData), 
                    isEmbed: true,
                    lastMessageId: null 
                },
                { upsert: true, new: true }
            );

            // Preview for Admin using the same data
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