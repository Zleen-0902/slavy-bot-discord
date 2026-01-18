<div align="center">

# 💎 SLAVY BOT
**"Elevate Your Discord Communication with Precision Sticky Messages"**

[![Discord.js](https://img.shields.io/badge/Framework-Discord.js%20v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-F7DF1E?style=for-the-badge&logo=opensource&logoColor=black)](LICENSE)

---

### ✦ Overview ✦
SlavyBot adalah solusi pesan tetap (Sticky Message) generasi terbaru yang dirancang untuk stabilitas tinggi dan kemudahan kustomisasi. Memastikan pengumuman penting Anda selalu berada di posisi paling bawah channel, tetap terlihat, dan tetap profesional.

[ **Invite SlavyBot** ] — [ **Support Server** ] — [ **Documentation** ]

</div>

---

## 🔱 Key Architectures
SlavyBot dibangun dengan standar industri untuk memastikan performa maksimal bagi bot publik:

* **Recursive Command Handler:** Memungkinkan manajemen ribuan perintah dalam sub-folder terorganisir.
* **Persistent Cloud Storage:** Menggunakan MongoDB Atlas untuk sinkronisasi data antar-server secara real-time.
* **Smart Message Recycling:** Logika penghapusan otomatis cerdas untuk menjaga kebersihan channel tanpa menumpuk pesan lama.

---

## 🛠️ Infrastructure Setup

### 1. Requirements
* Node.js **16.11.0** atau versi lebih tinggi.
* Instance MongoDB (Atlas atau Lokal).
* Token Discord Bot melalui [Developer Portal](https://discord.com/developers/applications).

### 2. Environment Variables (`.env`)
Pastikan variabel berikut terdefinisi dengan benar untuk mengaktifkan konektivitas database:
```env
TOKEN         = "Your_Discord_Bot_Token"
CLIENT_ID     = "Your_Application_ID"
MONGODB_URI   = "mongodb+srv://user:pass@cluster.mongodb.net/dbname"