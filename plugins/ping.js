const os = require("os");
const moment = require("moment");

module.exports = {
  command: "ping",
  handler: async (sock, m, sender, text, ownerId) => {
    try {
      const chatId = m.key.remoteJid || m.chat || m.from;

      const start = Date.now();
      await sock.sendPresenceUpdate('composing', chatId);
      const ping = Date.now() - start;

      const uptime = process.uptime(); // in seconds
      const formatTime = (s) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = Math.floor(s % 60);
        return `${h}h ${m}m ${sec}s`;
      };

      const response = `
╭───⌜ *Arslan-Ai Ping Report* ⌟
│ 🚀 *Speed:* ${ping}ms
│ ⏱️ *Uptime:* ${formatTime(uptime)}
│ 📶 *Status:* Online ✅
│ 👑 *Owner:* wa.me/${ownerId.split("@")[0]}
╰───────────────`;

      await sock.sendMessage(chatId, {
        text: response.trim(),
      }, { quoted: m });

    } catch (e) {
      console.error("❌ Ping2 Error:", e);
      await sock.sendMessage(m.key.remoteJid || m.chat || m.from, {
        text: "❌ Ping failed due to error."
      }, { quoted: m });
    }
  }
};
