module.exports = {
  command: 'test',
  handler: async (sock, m) => {
    await sock.sendMessage(m.from, { text: '✅ Test command is working!' }, { quoted: m });
  }
};
