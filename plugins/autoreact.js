const config = require("../config.cjs");

module.exports = {
  command: 'autostatus',
  handler: async (sock, m, sender, text, ownerId) => {
    try {
      const chatId = m.key.remoteJid || m.chat || sender;

      // ✅ Only allow owner
      if (!chatId.includes(ownerId.split('@')[0])) {
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

      // ℹ️ Invalid or missing argument
      return await sock.sendMessage(chatId, {
        text: 'ℹ️ *Usage:*\n.autostatus on\n.autostatus off'
      }, { quoted: m });

    } catch (err) {
      console.error("❌ autostatus error:", err);
      await sock.sendMessage(sender, {
        text: "❌ Unexpected error occurred in autostatus command."
      }, { quoted: m });
    }
  }
};
