<div align="center">

# 💎 SLAVY BOT
**"Elevate Your Discord Communication with Precision Sticky Messages"**

[![Discord.js](https://img.shields.io/badge/Framework-Discord.js%20v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-F7DF1E?style=for-the-badge&logo=opensource&logoColor=black)](LICENSE)

---

### ✦ Overview ✦
SlavyBot is a next-generation sticky messaging solution designed for high stability and easy customization. Ensure your important announcements are always at the top of your mind.

[ **Invite SlavyBot** ] — [ **Support Server** ] — [ **Documentation** ]

</div>

---

## 🔱 Key Architectures
SlavyBot is built to industry standards to ensure maximum performance for public bots:

* **Recursive Command Handler:** Allows management of thousands of commands in organized sub-folders.
* **Persistent Cloud Storage:** Using MongoDB Atlas for real-time data synchronization between servers.
* **Smart Message Recycling:** Smart auto-delete logic to keep channels clean without accumulating old messages.

---

## 🛠️ Infrastructure Setup

### 1. Requirements
* Node.js **16.11.0** or higher version.
* Instance MongoDB (Atlas or Local).
* Discord Bot Token via [Developer Portal](https://discord.com/developers/applications).

### 2. Environment Variables (`.env`)
Make sure the following variables are defined correctly to enable database connectivity:
```env
TOKEN         = "YOUR_DISCORD_BOT_TOKEN"
CLIENT_ID     = "YOUR_APPLICATION_ID"
OWNER_ID     = "YOUR_USER_ID"
MONGODB_URI   = "YOUR_MONGODB_URI"