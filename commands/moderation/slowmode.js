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

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('🕰️ Set chat stability protocol (Slowmode)')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('⏳ Slowmode duration (in seconds). Set to 0 to disable.')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600)), // Maximum 6 hours

    async execute(interaction) {
    await interaction.deferReply();
        const duration = interaction.options.getInteger('duration');
        const channel = interaction.channel;

        // Visual Progress Bar Logic
        const createProgressBar = (value, max) => {
            const size = 15;
            const progress = Math.round((value / max) * size);
            const emptyProgress = size - progress;
            const progressText = '▇'.repeat(progress);
            const emptyProgressText = '—'.repeat(emptyProgress);
            return `\`[${progressText}${emptyProgressText}]\``;
        };

        try {
            await channel.setRateLimitPerUser(duration);

            const isDeactivating = duration === 0;
            const statusColor = isDeactivating ? '#2ecc71' : '#f1c40f';
            const statusTitle = isDeactivating ? '🔓 Protocol: Normal Frequency' : '🔒 Protocol: Stability Engaged';
            
            // Measuring intensity (Visual Only for luxury)
            const intensity = createProgressBar(duration, 300); // Base max 5 minutes for visual

            const slowmodeEmbed = new EmbedBuilder()
                .setTitle(statusTitle)
                .setColor(statusColor)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setDescription(
                    isDeactivating 
                    ? `The monitoring system has disabled transmission restrictions. Chat is now running in **Real-Time** mode.` 
                    : `The system has detected high activity. The **Slowmode** protocol has been implemented to maintain data integrity.`
                )
                .addFields(
                    { 
                        name: '⏳ Delay Interval', 
                        value: `\`${duration} Seconds\``, 
                        inline: true 
                    },
                    { 
                        name: '📊 Flow Intensity', 
                        value: intensity, 
                        inline: true 
                    },
                    { 
                        name: '🕵️ Authorized Personnel', 
                        value: `${interaction.user}`, 
                        inline: false 
                    }
                )
                .setFooter({ 
                    text: `Slavy Infrastructure Management | System SlowMode`, 
                    iconURL: interaction.client.user.displayAvatarURL() 
                })
                .setTimestamp();

            return interaction.editReply({ embeds: [slowmodeEmbed] });

        } catch (error) {
            console.error(error);
            return interaction.editReply({ 
                content: '❌ A system failure occurred while trying to change the channel configuration.', 
                ephemeral: true 
            });
        }
    },
};