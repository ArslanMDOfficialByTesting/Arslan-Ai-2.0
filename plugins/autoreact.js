const config = require('../config.cjs');

module.exports = {
  command: 'autoreact',
  handler: async (sock, m, sender, text, ownerId) => {
    if (sender !== ownerId) return sock.sendMessage(sender, { text: "❌ Owner only command." }, { quoted: m });

    const arg = text.split(' ')[1]?.toLowerCase();
    if (arg === 'on') {
      config.AUTO_REACT = true;
      return sock.sendMessage(sender, { text: '✅ Auto-react enabled.' }, { quoted: m });
    } else if (arg === 'off') {
      config.AUTO_REACT = false;
      return sock.sendMessage(sender, { text: '🛑 Auto-react disabled.' }, { quoted: m });
    } else {
      return sock.sendMessage(sender, { text: 'ℹ️ Use `.autoreact on` or `.autoreact off`' }, { quoted: m });
    }
  }
};
