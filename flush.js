const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🧹 Sedang membersihkan semua Slash Commands (Global)...');
        // Menghapus semua command global
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
        console.log('✅ Berhasil menghapus semua command global.');
        
        console.log('💡 Silakan jalankan bot kamu kembali (index.js) untuk mendaftarkan ulang command yang benar.');
        process.exit();
    } catch (error) {
        console.error(error);
    }
})();
