<div align="center">

# 💎 SLAVY BOT
**"Next-Generation Moderation & Security with Unmatched Stability"**

[![Discord.js](https://img.shields.io/badge/Framework-Discord.js%20v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-F7DF1E?style=for-the-badge&logo=opensource&logoColor=black)](LICENSE)

---

### ✦ Overview ✦
SlavyBot has evolved into a comprehensive **Moderation & Security solution**. No longer just a sticky messaging tool, it now offers a powerful suite of commands to protect, monitor, and manage your Discord community with high-level performance.

[ **Invite SlavyBot** ] — [ **Support Server** ] — [ **Website** ]

</div>

---

## 🔱 Key Architectures
SlavyBot is built to industry standards to ensure maximum performance for professional communities:

* **Advanced Moderation:** Comprehensive system including `/ban`, `/kick`, `/warn`, and `/mute` with full database history.
* **Automated Security:** Integrated `/toggle-antilink` and `/toggle-antispam` to shield your server from raids and spam.
* **Advance Log System:** Detailed event tracking for transparency, managed via the `/setlog` configuration.
* **Persistent Cloud Storage:** Using **MongoDB Atlas** for secure, real-time data synchronization across all guilds.

---

## 📜 Commands Overview
SlavyBot comes equipped with a diverse range of features:
* **Moderation:** Ban, Kick, Warn/Unwarn, Mute/Unmute, Checkwarns, Clear, Slowmode.
* **Admin:** Setlog, Toggle-Antilink, Toggle-Antispam.
* **Utility:** AFK, Avatar, Embed, Poll, Remind, Sticky (Classic & Embed).
* **Information:** Bot Status, Help, Server, User.

---

## 🛠️ Infrastructure Setup

### 1. Requirements
* Node.js **16.11.0** or higher version.
* Instance MongoDB (Atlas or Local).
* Discord Bot Token via [Developer Portal](https://discord.com/developers/applications).

### 2. Environment Variables (`.env`)
Make sure the following variables are defined correctly to enable database and bot connectivity:
```env
TOKEN         = "YOUR_DISCORD_BOT_TOKEN"
CLIENT_ID     = "YOUR_APPLICATION_ID"
OWNER_ID      = "YOUR_USER_ID"
MONGODB_URI   = "YOUR_MONGODB_URI"