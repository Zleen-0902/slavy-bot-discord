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

const { SlashCommandBuilder, EmbedBuilder, version, MessageFlags } = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('🤖 Display detailed information about Slavy Bot'),
    async execute(interaction) {
        // FIX: Mandatory deferReply before doing heavy processes (Ping DB) & editReply
        await interaction.deferReply();

        // Calculating Uptime
        let totalSeconds = (interaction.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        // Calculating Database Latency (MongoDB)
        let dbLatency = 'Error';
        try {
            const dbStartTime = Date.now();
            await mongoose.connection.db.admin().ping();
            dbLatency = `${Date.now() - dbStartTime} ms`;
        } catch (e) {
            dbLatency = 'Disconnected';
        }

        const botInfoEmbed = new EmbedBuilder()
            .setColor('#00ffff')
            .setAuthor({ 
                name: 'Slavy Bot Information', 
                iconURL: interaction.client.user.displayAvatarURL() 
            })
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: '🤖 Bot Name', value: `${interaction.client.user.username}`, inline: true },
                { name: '👑 Owner', value: 'Enzzyx\n`ID: 1446414970274189479`', inline: true },
                { name: '📚 Library', value: `Discord.js v${version}`, inline: true },
                { name: '💻 Language', value: 'Node.js (JavaScript)', inline: true },
                
                { name: '\u200B', value: '\u200B' }, // Blank line/delimiter

                { name: '📶 Ping Discord Bot', value: `\`${interaction.client.ws.ping} ms\``, inline: false },
                { name: '📺 Uptime Discord Bot', value: `\`${uptimeString}\``, inline: false },
                { name: '🍃 Database Latency', value: `\`${dbLatency}\``, inline: false },
            )
            .setFooter({ 
                text: 'Enzzyx || Hazz Wave Studio || Slavy ©️ 2026',
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTimestamp();

        // Use editReply because there is already deferReply above
        await interaction.editReply({ embeds: [botInfoEmbed] });
    },
};