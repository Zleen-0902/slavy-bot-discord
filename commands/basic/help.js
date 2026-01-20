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

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📜 Displays a list of Slavy Bot commands'),

    async execute(interaction) {
        await interaction.deferReply();
        
        // Retrieves the Owner ID from the .env file
        const ownerId = process.env.OWNER_ID;
        
        const helpEmbed = new EmbedBuilder()
            .setTitle('🛠️ Slavy Command Center')
            .setColor('#00ffff')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setDescription('Hi! I am **Slavy**, your utility assistant. Here is a brief guide to my commands:')
            .addFields(
                { 
                    name: '🏠 Basic', 
                    value: '• `/bot`: Info & status\n• `/help`: Command list\n• `/server`: Guild info\n• `/user`: User profile info', 
                    inline: false 
                },
                { 
                    name: '📌 Sticky', 
                    value: '• `/sticky`: Regular sticky\n• `/stickyEmbed`: Embed version\n• `/unsticky`: Remove sticky', 
                    inline: false 
                },
                { 
                    name: '⚙️ Utility', 
                    value: '• `/afk`: Set AFK status\n• `/avatar`: Get user avatar\n• `/embed`: Custom embed\n• `/poll`: Create voting\n• `/remind`: Set reminder', 
                    inline: false 
                },
                { 
                    name: '⚖️ Moderation', 
                    value: '• `/ban`/`/unban`: Ban management\n• `/kick`: Remove member\n• `/mute`/`/unmute`: Timeout control\n• `/warn`/`/unwarn`/`/checkwarns`: Warning system\n• `/slowmode`: Channel cooldown\n• `/clear`: Delete messages', 
                    inline: false 
                },
                { 
                    name: '🛡️ Admin', 
                    value: '• `/setlog`: Setup logging channel\n• `/toggle-antilink`: Anti-link filter\n• `/toggle-antispam`: Anti-spam protection', 
                    inline: false 
                }
            );

        // --- DYNAMIC LOGIC OWNER ONLY ---
        // Verify if the user matches the OWNER_ID from .env
        if (interaction.user.id === ownerId) {
            helpEmbed.addFields({
                name: '👑 Owner Only',
                value: '• `/botstatus`: Set bot presence\n• `/eval`: Execute JS code\n• `/reload`: Refresh commands',
                inline: false
            });
        }

        // Add final fields and visual elements
        helpEmbed.addFields({
            name: '🔗 Links',
            value: '[Support Server](https://discord.gg/QYVcWZbBp) | [Guns.lol](https://guns.lol/enzzyx) | [Slavy Web](https://slavy-bot-discord.vercel.app/)',
            inline: false
        })
        .setImage('https://cdn.discordapp.com/attachments/1458005760788140062/1463173443028517126/ad6b00a8b07ef35e3a89805ea3c5a890.gif?ex=6970ddf5&is=696f8c75&hm=af9ccad2fddae2e87bffafa4bea77529a59070b4fedf7da87f96327832bec645&')
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

        await interaction.editReply({ 
            embeds: [helpEmbed]
        });
    }
};