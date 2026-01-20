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

const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('👑 Reloads commands (Owner Only)')
        .addStringOption(option =>
            option.setName('folder')
                .setDescription('📁 The folder of the command')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('command')
                .setDescription('⚠️ Command names, separate with space (ex: ban kick mute)')
                .setRequired(true)),

    async execute(interaction) {
        // FIX: Defer is placed at the top so that the interaction does not expire (Unknown Interaction)
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        // Check Owner
        if (interaction.user.id !== process.env.OWNER_ID) {
            return interaction.editReply({ content: '❌ Restricted Access: Owner Only.' });
        }

        const folderName = interaction.options.getString('folder');
        const commandsInput = interaction.options.getString('command').toLowerCase();
        
        // Splits input string into array (e.g. "ban kick" becomes ["ban", "kick"])
        const commandNames = commandsInput.split(/\s+/);
        
        const success = [];
        const failed = [];

        for (const name of commandNames) {
            const command = interaction.client.commands.get(name);

            if (!command) {
                failed.push(`\`${name}\` (Not found)`);
                continue;
            }

            const filePath = path.join(__dirname, `../../commands/${folderName}/${command.data.name}.js`);
            
            try {
                // Clearing the cache of old files so that new files can be read
                delete require.cache[require.resolve(filePath)];
                const newCommand = require(filePath);
                interaction.client.commands.set(newCommand.data.name, newCommand);
                success.push(`\`${newCommand.data.name}\``);
            } catch (error) {
                console.error(`[RELOAD ERROR] ${name}:`, error);
                failed.push(`\`${name}\` (Error)`);
            }
        }

        // Compile a reload results report
        let responseContent = "";
        if (success.length > 0) responseContent += `✅ Reloaded: ${success.join(', ')}\n`;
        if (failed.length > 0) responseContent += `❌ Failed: ${failed.join(', ')}`;
        if (success.length === 0 && failed.length === 0) responseContent = "⚠️ No commands were processed.";

        // Use editReply because the status is already "deferred" above
        await interaction.editReply({ content: responseContent });
    },
};