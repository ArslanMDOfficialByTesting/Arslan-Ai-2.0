const config = require("../config.cjs");

module.exports = {
  command: 'autostatus',
  handler: async (sock, m, sender, text, ownerId) => {
    const chatId = m.key.remoteJid;

    // ✅ Owner check
    if (sender !== ownerId) {
      return await sock.sendMessage(chatId, {
        text: '❌ Owner-only command.'
      }, { quoted: m });
    }

    const arg = text.split(' ')[1]?.toLowerCase();

    if (arg === 'on') {
      config.AUTO_STATUS_SEEN = true;
      return await sock.sendMessage(chatId, {
        text: '✅ Auto Status Seen turned *ON*'
      }, { quoted: m });
    }

    if (arg === 'off') {
      config.AUTO_STATUS_SEEN = false;
      return await sock.sendMessage(chatId, {
        text: '🛑 Auto Status Seen turned *OFF*'
      }, { quoted: m });
    }

    // 🧾 Invalid usage
    return await sock.sendMessage(chatId, {
      text: 'ℹ️ *Usage:*\n.autostatus on\n.autostatus off'
    }, { quoted: m });
  }
};
