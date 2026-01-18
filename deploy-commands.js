require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const colors = {
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

console.log(`${colors.cyan}${colors.bold}=================================================${colors.reset}`);
console.log(`${colors.bold}          SLAVY BOT - ADVANCED DEPLOYER${colors.reset}`);
console.log(`${colors.cyan}=================================================${colors.reset}`);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    
    // Pastikan yang dibaca adalah folder
    if (fs.lstatSync(commandsPath).isDirectory()) {
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
                console.log(`${colors.green}[LOADED]${colors.reset} ${folder}/${file}`);
            }
        }
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`\n${colors.yellow}⏳ Meregistrasi ${commands.length} command ke Discord...${colors.reset}`);

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`${colors.green}${colors.bold}✅ BERHASIL!${colors.reset} Struktur sub-folder terbaca sempurna.`);
    } catch (error) {
        console.error(`${colors.red}❌ FAILED:${colors.reset}`, error);
    }
    console.log(`${colors.cyan}${colors.bold}=================================================${colors.reset}\n`);
})();