const config = require("../config.cjs");

module.exports = {
  command: 'autoreact',
  handler: async (sock, m, sender, text, ownerId) => {
    const senderId = m.key.participant || m.key.remoteJid || m.participant || m.sender || '';
    if (!senderId.includes(ownerId.split('@')[0])) {
      await sock.sendMessage(m.key.remoteJid, { text: '❌ Owner-only command.' }, { quoted: m });
      return;
    }

    const input = text.split(' ')[1];
    if (!input || !['on', 'off'].includes(input.toLowerCase())) {
      return sock.sendMessage(m.key.remoteJid, {
        text: `📍 Usage:\n.autoreact on\n.autoreact off`
      }, { quoted: m });
    }

    config.AUTO_REACT = input.toLowerCase() === 'on';
    await sock.sendMessage(m.key.remoteJid, {
      text: `✅ Auto React turned *${config.AUTO_REACT ? 'ON' : 'OFF'}*`
    }, { quoted: m });
  }
};
