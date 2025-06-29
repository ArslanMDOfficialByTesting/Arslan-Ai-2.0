const config = require('../config.cjs');

module.exports = {
  command: 'autoreact',
  handler: async (sock, m, sender, text, ownerId) => {
    if (!sender.includes(ownerId.split('@')[0])) {
      return await sock.sendMessage(m.key.remoteJid, {
        text: "❌ *Only owner can use this command.*"
      }, { quoted: m });
    }

    const arg = text.split(' ')[1]?.toLowerCase();

    if (arg === 'on') {
      config.AUTO_REACT = true;
      await sock.sendMessage(m.key.remoteJid, {
        text: '✅ *Auto React feature turned ON.*'
      }, { quoted: m });
    } else if (arg === 'off') {
      config.AUTO_REACT = false;
      await sock.sendMessage(m.key.remoteJid, {
        text: '🛑 *Auto React feature turned OFF.*'
      }, { quoted: m });
    } else {
      await sock.sendMessage(m.key.remoteJid, {
        text: `ℹ️ *Usage:*\n.autoreact on\n.autoreact off`
      }, { quoted: m });
    }
  }
};
