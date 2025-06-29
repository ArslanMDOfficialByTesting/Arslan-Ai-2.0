const config = require('../config.cjs');

module.exports = {
  command: 'autostatus',
  handler: async (sock, m, sender, text, ownerId) => {
    const chatId = m.key?.remoteJid || m.chat || sender;

    if (!sender.includes(ownerId.split('@')[0])) {
      return await sock.sendMessage(chatId, {
        text: "❌ *Only owner can use this command.*"
      }, { quoted: m });
    }

    const arg = text.split(' ')[1]?.toLowerCase();

    if (arg === 'on') {
      config.AUTO_STATUS_SEEN = true;
      return await sock.sendMessage(chatId, {
        text: '✅ *Auto Status Seen enabled.*'
      }, { quoted: m });
    }

    if (arg === 'off') {
      config.AUTO_STATUS_SEEN = false;
      return await sock.sendMessage(chatId, {
        text: '🛑 *Auto Status Seen disabled.*'
      }, { quoted: m });
    }

    return await sock.sendMessage(chatId, {
      text: `ℹ️ *Usage:*\n.autostatus on\n.autostatus off`
    }, { quoted: m });
  }
};
