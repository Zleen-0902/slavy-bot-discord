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
const { EmbedBuilder, Collection } = require('discord.js');
const User = require('../models/User'); 
const GuildConfig = require('../models/GuildConfig'); 
const { sendLog } = require('../utils/logger');

// Cache to store temporary message logs (Anti-Spam)
const spamMap = new Collection();
const SPAM_THRESHOLD = 4; // Maximum 4 messages
const SPAM_INTERVAL = 4000; // In 4 seconds

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // Do not respond to other bots or messages in DM
        if (message.author.bot || !message.guild) return;

        const config = await GuildConfig.findOne({ guildId: message.guild.id });

        // --- 1. AUTO-MOD: ANTI-LINK SYSTEM ---
        if (config && config.antiLink) {
            if (!message.member.permissions.has('ManageMessages')) {
                const linkPatterns = /(https?:\/\/|discord\.gg\/|www\.)/i;
                if (linkPatterns.test(message.content)) {
                    await message.delete().catch(() => null);
                    
                    const warnMsg = await message.channel.send(`${message.author}, **No link posting allowed!** Slavy has deleted your message. 🛡️`);
                    setTimeout(() => warnMsg.delete().catch(() => null), 5000);

                    const logEmbed = new EmbedBuilder()
                        .setTitle('🛡️ Auto-Mod Action: ANTI-LINK')
                        .setColor('#f1c40f')
                        .addFields(
                            { name: '👤 User', value: `${message.author.tag} (${message.author.id})`, inline: true },
                            { name: '📺 Channel', value: `<#${message.channel.id}>`, inline: true },
                            { name: '📄 Content', value: `\`\`\`${message.content}\`\`\`` }
                        )
                        .setTimestamp();

                    await sendLog(message.guild, logEmbed);
                    return; 
                }
            }
        }

        // --- 2. AUTO-MOD: ANTI-SPAM SYSTEM ---
        if (config && config.antiSpam) {
            if (!message.member.permissions.has('ManageMessages')) {
                const now = Date.now();
                if (!spamMap.has(message.author.id)) {
                    spamMap.set(message.author.id, []);
                }

                const timestamps = spamMap.get(message.author.id);
                timestamps.push(now);

                // Filter timestamps that fall within the spam time interval
                const recentMessages = timestamps.filter(t => now - t < SPAM_INTERVAL);
                spamMap.set(message.author.id, recentMessages);

                if (recentMessages.length > SPAM_THRESHOLD) {
                    await message.delete().catch(() => null);
                    
                    const spamWarn = await message.channel.send(`${message.author}, **Please slow down!** Stop spamming. 🛡️`);
                    setTimeout(() => spamWarn.delete().catch(() => null), 3000);

                    const logEmbed = new EmbedBuilder()
                        .setTitle('🛡️ Auto-Mod Action: ANTI-SPAM')
                        .setColor('#e74c3c')
                        .addFields(
                            { name: '👤 User', value: `${message.author.tag} (${message.author.id})`, inline: true },
                            { name: '📺 Channel', value: `<#${message.channel.id}>`, inline: true },
                            { name: '📄 Info', value: 'Flooding messages too fast.' }
                        )
                        .setTimestamp();

                    await sendLog(message.guild, logEmbed);
                    return;
                }
            }
        }

        // --- 3. AFK SYSTEM: CHECK IF THE USER WHO SENT THE MESSAGE IS AFK ---
        const userData = await User.findOne({ userId: message.author.id });
        
        if (userData && userData.afk && userData.afk.is_afk) {
            userData.afk.is_afk = false;
            userData.afk.reason = '';
            await userData.save();

            const welcomeBackEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setDescription(`👋 Welcome back, <@${message.author.id}>! Your AFK status has been removed.`);

            message.channel.send({ embeds: [welcomeBackEmbed] }).then(msg => {
                setTimeout(() => msg.delete().catch(() => {}), 5000);
            });
        }

        // --- 4. AFK SYSTEM: CHECK IF THE MESSAGE MENTIONS THE PERSON WHO IS AFK ---
        if (message.mentions.users.size > 0) {
            message.mentions.users.forEach(async (mentionedUser) => {
                const mentionedData = await User.findOne({ userId: mentionedUser.id });

                if (mentionedData && mentionedData.afk && mentionedData.afk.is_afk) {
                    const timeAgo = Math.floor(mentionedData.afk.time / 1000);
                    
                    const afkNotifyEmbed = new EmbedBuilder()
                        .setColor('#f1c40f')
                        .setAuthor({ 
                            name: `${mentionedUser.username} is busy`, 
                            iconURL: mentionedUser.displayAvatarURL() 
                        })
                        .setDescription(
                            `💬 **Reason:** ${mentionedData.afk.reason}\n` +
                            `⏰ **Since:** <t:${timeAgo}:R>`
                        );

                    message.reply({ embeds: [afkNotifyEmbed] });
                }
            });
        }
    },
};