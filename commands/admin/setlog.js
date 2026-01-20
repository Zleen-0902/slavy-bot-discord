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

const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../models/GuildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlog')
        .setDescription('📡 Set channel log for moderation activity')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('Select channel for log report')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        await interaction.deferReply();

        try {
            // Update or create a new config in MongoDB
            await GuildConfig.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { logChannelId: channel.id },
                { upsert: true, new: true }
            );

            const successEmbed = new EmbedBuilder()
                .setTitle('📡 Logger System')
                .setColor('#00ffff')
                .setDescription(`Successfully set log channel to ${channel}. Any moderation actions will be reported here.`)
                .setFooter({ text: 'Slavy Security System • Configuration Saved' })
                .setTimestamp();
            
            await interaction.editReply({ 
                embeds: [successEmbed] 
            });

        } catch (error) {
            console.error(error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#ff4757')
                .setDescription('❌ Failed to save log configuration to database.');

            interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};