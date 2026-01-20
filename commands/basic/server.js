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

const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('📊 Display detailed information about this server'),
    async execute(interaction) {
    await interaction.deferReply();
        try {
            const { guild } = interaction;

            // Fetch the server owner
            const owner = await guild.fetchOwner();

            // Counting members, bots, and roles
            const totalMembers = guild.memberCount;
            const botCount = guild.members.cache.filter(member => member.user.bot).size;
            const humanCount = totalMembers - botCount;
            const roleCount = guild.roles.cache.size;

            const serverInfoEmbed = new EmbedBuilder()
                .setColor('#00ffff')
                .setAuthor({ 
                    name: `Server Info: ${guild.name}`, 
                    iconURL: guild.iconURL({ dynamic: true }) 
                })
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
                .addFields(
                    { name: ' castles Server Name', value: `${guild.name || 'Unknown Server / Slavy Base'}`, inline: true },
                    { name: '🆔 Server ID', value: `\`${guild.id}\``, inline: true },
                    { name: '👑 Owner', value: `${owner.user.tag}\n(\`${guild.ownerId}\`)`, inline: true },
                    
                    { name: '\u200B', value: '\u200B' }, // divider

                    { name: '📅 Created Date', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: '🎭 Roles', value: `\`${roleCount}\` Roles`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true }, // Spacer

                    { name: '👥 Members Count', value: `Total: \`${totalMembers}\` Members\n👤 Humans: \`${humanCount}\`\n🤖 Bots: \`${botCount}\``, inline: false },
                )
                .setFooter({ 
                    text: 'Enzzyx || Hazz Wave Studio || Slavy ©️ 2026',
                    iconURL: interaction.client.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [serverInfoEmbed] });

        } catch (error) {
            console.error('[ERROR] Server Command:', error);
            if (interaction.deferred) {
                await interaction.editReply({ 
                    content: '❌ An error occurred while fetching server info.',
                });
            } else {
                await interaction.editReply({ 
                    content: '❌ An error occurred while fetching server info.',
                    flags: [MessageFlags.Ephemeral]
                });
            }
        }
    },
};