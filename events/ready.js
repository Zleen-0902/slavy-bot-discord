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
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'clientReady',
    once: true, 
    execute(client) {
        const color = {
            green: '\x1b[32m',
            red: '\x1b[31m',
            cyan: '\x1b[36m',
            yellow: '\x1b[33m',
            reset: '\x1b[0m',
            bold: '\x1b[1m'
        };

        const divider = `${color.cyan}=================================================${color.reset}`;

        console.log(divider);
        console.log(`${color.bold}${color.cyan}          SLAVY BOT - TERMINAL DASHBOARD${color.reset}`);
        console.log(divider);
        
        try {
            console.log(`${color.green}  [STATUS]  ${color.reset}Online Bot as: ${color.bold}${client.user.tag}${color.reset}`);
            console.log(`${color.green}  [GUILDS]  ${color.reset} Serve: ${client.guilds.cache.size} Server`);
            console.log(`${color.green}  [DATE]    ${color.reset}${new Date().toLocaleString()}`);
            
            console.log(`${color.cyan}
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
            ${color.reset}`);

            console.log(divider);
            console.log(`${color.cyan}👑 Owner    : ${color.reset}Enzzyx`);
            console.log(`${color.cyan}📡 Discord   : ${color.reset}https://discord.gg/QYVcWZbBp`);
            console.log(`${color.cyan}🛠️ Studio    : ${color.reset}Hazz Wave Studio`);
            console.log(`${color.yellow}✅ Verified | ⚡ Flexible | ⚙️ Stable${color.reset}`);
            console.log(divider);
            console.log(`${color.bold}> © 2026 Enzzyx || Hazz Wave Studio || Slavy${color.reset}`);
            console.log(divider);
            
            // --- SET ACTIVITY & STATUS ---
// Set Sadrah Listening - For Revenge and Status
            client.user.setPresence({
                activities: [{ 
                    name: '🎶 Sadrah - For Revenge', 
                    type: ActivityType.Listening 
                }],
                status: 'dnd', 
            });
            
            console.log(`${color.green}  [SUCCESS] ${color.reset}The bot is ready to receive commands!`);
        } catch (error) {
            console.log(`${color.red}  [ERROR]   ${color.reset}An error occurred while starting the bot!`);
            console.error(error);
        }
        console.log(divider);
    },
};
