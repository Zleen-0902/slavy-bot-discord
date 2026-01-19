require('dotenv').config();
const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose'); 
const Sticky = require('./models/Sticky'); 
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const connectDB = require('./mongodb.js');

const app = express();
const port = process.env.PORT || 3000;

// Run professional database connection
connectDB();

// Set the 'public' folder as a static folder
app.use(express.static(path.join(__dirname, 'public')));

// The main route to call index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`🌐 Website Dashboard is active on port: ${port}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Handler for Commands (Supports Sub-folders)
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    if (fs.lstatSync(commandsPath).isDirectory()) {
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

// --- Event Handler ---
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.name && event.execute) {
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
    }
}

// --- Event: Sticky Message Logic ---
client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;

    const data = await Sticky.findOne({ guildId: message.guildId });

    if (data && message.channel.id === data.channelId) {
        if (data.lastMessageId) {
            try {
                const oldMsg = await message.channel.messages.fetch(data.lastMessageId);
                if (oldMsg) await oldMsg.delete();
            } catch (e) {
                // Ignore if old messages have been deleted
            } 
        }

        let newMessage;
        try {
            if (data.isEmbed) {
                const embedObject = JSON.parse(data.content);
                const stickyEmbed = new EmbedBuilder(embedObject);
                newMessage = await message.channel.send({ embeds: [stickyEmbed] });
            } else {
                newMessage = await message.channel.send(data.content);
            }

            data.lastMessageId = newMessage.id;
            await data.save();
        } catch (err) {
            console.error("❌ Failed to send sticky message:", err);
        }
    }
});

client.login(process.env.TOKEN);
