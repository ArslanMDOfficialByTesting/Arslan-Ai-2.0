module.exports = {
  command: 'ping2',
  handler: async (sock, m, sender, text, ownerId) => {
    try {
      const chatId = m.key.remoteJid || m.from;  // safest way to get JID
      const start = Date.now();
      await sock.sendPresenceUpdate('composing', chatId);
      const end = Date.now();
      const ping = end - start;

      await sock.sendMessage(chatId, {
        text: `🚀 *Ping:* ${ping}ms\n👑 *Owner:* wa.me/${ownerId?.split('@')[0]}`
      }, { quoted: m });
    } catch (e) {
      console.error("Ping2 error:", e);
      await sock.sendMessage(m.key.remoteJid, { text: "❌ Failed to respond." }, { quoted: m });
    }
  }
};
