const config = require('../config.cjs');

module.exports = {
  command: 'autostatus',
  handler: async (sock, m, sender, text, ownerId) => {
    if (sender !== ownerId) {
      return sock.sendMessage(m.from, { text: "❌ *Only owner can use this command.*" }, { quoted: m });
    }

    const arg = text.split(' ')[1]?.toLowerCase();

    if (arg === 'on') {
      config.AUTO_STATUS_SEEN = true;
      await sock.sendMessage(m.from, { text: '✅ *Auto Status Seen enabled.*' }, { quoted: m });
    } else if (arg === 'off') {
      config.AUTO_STATUS_SEEN = false;
      await sock.sendMessage(m.from, { text: '🛑 *Auto Status Seen disabled.*' }, { quoted: m });
    } else {
      await sock.sendMessage(m.from, {
        text: `ℹ️ *Usage:*\n.autostatus on\n.autostatus off`
      }, { quoted: m });
    }
  }
};
