module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Check if this interaction is a slash (/) command
        if (!interaction.isChatInputCommand()) return;

        // Take the command from the Collection that we have set in index.js
        const command = interaction.client.commands.get(interaction.commandName);

        // If the command is not found, do nothing.
        if (!command) {
            console.error(`[ERROR] No commands match ${interaction.commandName}`);
            return;
        }

        try {
            // Run the execute function in the related command file
            await command.execute(interaction);
        } catch (error) {
            console.error(`[ERROR] An error occurred while running ${interaction.commandName}:`, error);
            
            // Notify users if there is a problem so that the bot does not appear to "hang"
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'An error occurred while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'An error occurred while executing this command!', ephemeral: true });
            }
        }
    },
};