require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose'); // Ganti Quick.db ke Mongoose
const Sticky = require('./models/Sticky'); // Import model MongoDB
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Mengatur folder 'website' sebagai folder statis
app.use(express.static(path.join(__dirname, 'website')));

// Route utama untuk memanggil index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'website', 'index.html'));
});

app.listen(port, () => {
    console.log(`🌐 Website Dashboard aktif di port: ${port}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// --- Koneksi MongoDB ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('\x1b[32m[DB] Berhasil terhubung ke MongoDB Atlas\x1b[0m'))
    .catch(err => console.error('\x1b[31m[DB] Gagal koneksi MongoDB:\x1b[0m', err));

// Handler untuk Commands (Mendukung Sub-folder)
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    if (fs.lstatSync(commandsPath).isDirectory()) { // Cek jika itu folder
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            }
        }
    }
}

// --- Event: Ready dengan Tampilan Profesional ---
client.once('ready', () => {
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
        console.log(`${color.green}  [STATUS]  ${color.reset}Bot Online sebagai: ${color.bold}${client.user.tag}${color.reset}`);
        console.log(`${color.green}  [GUILDS]  ${color.reset}Melayani: ${client.guilds.cache.size} Server`);
        console.log(`${color.green}  [DATE]    ${color.reset}${new Date().toLocaleString()}`);
        
        client.user.setActivity('/stick | Moderation', { type: 3 });
        
        console.log(`${color.green}  [SUCCESS] ${color.reset}Bot siap menerima perintah!`);
    } catch (error) {
        console.log(`${color.red}  [ERROR]   ${color.reset}Terjadi kesalahan saat memulai bot!`);
        console.error(error);
    }
    console.log(divider);
});

// Event: Interaction (Slash Commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction); // Database akan dihandle di masing-masing file command
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Terjadi kesalahan!', ephemeral: true });
    }
});

// --- Event: Sticky Message Logic (Updated: Support Text & Embed) ---
client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    // Ambil data dari MongoDB berdasarkan Guild ID
    const data = await Sticky.findOne({ guildId: message.guildId });

    if (data && message.channel.id === data.channelId) {
        // Hapus pesan lama jika ada
        if (data.lastMessageId) {
            try {
                const oldMsg = await message.channel.messages.fetch(data.lastMessageId);
                if (oldMsg) await oldMsg.delete();
            } catch (e) {
                // Abaikan jika pesan lama sudah dihapus manual atau tidak ditemukan
            } 
        }

        // Kirim pesan baru (Logika Pembeda Text/Embed)
        let newMessage;
        try {
            if (data.isEmbed) {
                // Jika isEmbed true, ubah JSON string kembali menjadi object untuk Embed
                const embedObject = JSON.parse(data.content);
                const stickyEmbed = new EmbedBuilder(embedObject);
                newMessage = await message.channel.send({ embeds: [stickyEmbed] });
            } else {
                // Jika isEmbed false, kirim sebagai teks biasa
                newMessage = await message.channel.send(data.content);
            }

            // Update ID pesan terbaru ke MongoDB agar bisa dihapus nanti
            data.lastMessageId = newMessage.id;
            await data.save();
        } catch (err) {
            console.error("❌ Gagal mengirim sticky message:", err);
        }
    }
});

client.login(process.env.TOKEN);