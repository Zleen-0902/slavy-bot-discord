/*
--------------------------------------------
👑 Owner    : Enzzyx
📡 Discord  : https://discord.gg/QYVcWZbBp
🛠️ Studio   : Hazz Wave Studio
✅ Verified | 🧩 Flexible | ⚙️ Stable
--------------------------------------------
> © 2026 Enzzyx || Hazz Wave Studio || Slavy
--------------------------------------------
*/
const colors = {
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        try {
            // Get the server owner info
            const owner = await guild.fetchOwner();
            
            console.log(`${colors.cyan}${colors.bold}=================================================${colors.reset}`);
            console.log(`${colors.green}[INVITE]${colors.reset} ${colors.bold}Slavy added to a new server!${colors.reset}`);
            console.log(`${colors.cyan}• Server Name :${colors.reset} ${guild.name}`);
            console.log(`${colors.cyan}• Server ID   :${colors.reset} ${guild.id}`);
            console.log(`${colors.cyan}• Members     :${colors.reset} ${guild.memberCount}`);
            console.log(`${colors.cyan}• Owner       :${colors.reset} ${owner.user.tag} (${owner.id})`);
            console.log(`${colors.cyan}${colors.bold}=================================================${colors.reset}`);

        } catch (error) {
            // Fallback if the fetch owner fails (usually because the bot lacks permission)
            console.log(`${colors.green}[INVITE]${colors.reset} Slavy added to: ${guild.name} (Member: ${guild.memberCount})`);
        }
    },
};