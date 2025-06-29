module.exports = {
  command: 'ping2',
  handler: async (sock, m, sender, text, ownerId) => {
    try {
      const start = Date.now();
      await sock.sendPresenceUpdate('composing', m.from);
      const end = Date.now();
      const ping = end - start;

      await sock.sendMessage(m.from, {
        text: `🚀 *Ping:* ${ping}ms\n👑 *Owner:* wa.me/${ownerId.split('@')[0]}`
      }, { quoted: m });
    } catch (e) {
      console.error("Ping2 error:", e);
      await sock.sendMessage(m.from, { text: "❌ Failed to respond." }, { quoted: m });
    }
  }
};
