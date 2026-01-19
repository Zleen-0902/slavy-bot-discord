const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        // Terminal Decoration (Original Slavy Style)
        const line = '━'.repeat(45);
        const cyan = '\x1b[36m';
        const green = '\x1b[32m';
        const reset = '\x1b[0m';
        const bold = '\x1b[1m';

        console.log(`\n${cyan}${line}${reset}`);
        console.log(`${cyan}${bold}   ⚡ SLAVY DATABASE SYSTEM${reset}`);
        console.log(`${cyan}${line}${reset}`);

        const options = {
            autoIndex: true, // Ensure MongoDB indexes are created automatically
        };

        // Connecting to MongoDB Atlas
        await mongoose.connect(process.env.MONGODB_URI, options);
        
        console.log(`${green}[ SUCCESS ]${reset} Mongoose Engine: ${bold}Connected${reset}`);
        console.log(`${green}[ STATUS  ]${reset} Database Atlas: ${bold}Ready${reset}`);
        console.log(`${cyan}${line}${reset}\n`);

    } catch (err) {
        console.error('\x1b[31m[ FATAL ERROR ]\x1b[0m Failed to connect to database:');
        console.error(err.message);
        
        // Kill bot if database is not ready (prevent bot error while running)
        process.exit(1);
    }
};

module.exports = connectDB;