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
const ms = require('ms');
const User = require('../../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind')
        .setDescription('⏰ Set reminders for important things')
        .addStringOption(option => option.setName('time').setDescription('Time (e.g. 10m, 1h, 1s)').setRequired(true))
        .addStringOption(option => option.setName('task').setDescription('What do you want to remind us of?').setRequired(true)),
    async execute(interaction) {
    await interaction.deferReply();
        const timeInput = interaction.options.getString('time');
        const task = interaction.options.getString('task');
        const duration = ms(timeInput);
        const channelId = interaction.channel.id; // Saves the current channel ID

        if (!duration) return interaction.editReply({ content: '❌ Incorrect time format! Use `10s`, `5m`, `1h`, or `1d`.', flags: [MessageFlags.Ephemeral] });

        const remindTime = Date.now() + duration;

        await User.findOneAndUpdate(
            { userId: interaction.user.id },
            { $push: { reminders: { content: task, time: remindTime } } },
            { upsert: true }
        );

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('⏰ Reminder Set!')
            .setDescription(`Slavy will remind you about: **${task}**\n🕒 Time: **${timeInput} from now on**`)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

        setTimeout(async () => {
            const remindEmbed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('🔔 Its time!')
                .setDescription(`Hello <@${interaction.user.id}>, you asked to be reminded earlier: **${task}**`)
                .setTimestamp();

            // Logic: Try sending a DM, if it fails send it to the original channel
            try {
                await interaction.user.send({ embeds: [remindEmbed] });
            } catch (err) {
                const channel = await interaction.client.channels.fetch(channelId).catch(() => null);
                if (channel) {
                    await channel.send({ content: `<@${interaction.user.id}> (DM Locked)`, embeds: [remindEmbed] });
                }
            }
            
            await User.updateOne({ userId: interaction.user.id }, { $pull: { reminders: { time: remindTime } } });
        }, duration);
    },
};