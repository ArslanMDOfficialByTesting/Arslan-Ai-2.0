const config = require('../config.cjs');

module.exports = {
  command: 'ping2',

  handler: async (sock, m, sender, text) => {
    const start = Date.now();

    const reactionEmojis = ['🔥', '⚡', '🚀', '👻', '🎲', '🔗', '🌟', '💥', '🕐', '🔹'];
    const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '⭐', '🔱', '🛡️', '✨'];

    const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
    let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

    while (textEmoji === reactionEmoji) {
      textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
    }

    await m.React(textEmoji);

    const end = Date.now();
    const responseTime = (end - start);

    const replyText = `*${config.BOT_NAME} S𝙿𝙴𝙴𝙳: ${responseTime}ms ${reactionEmoji}*`;

    await sock.sendMessage(m.from, {
      text: replyText,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: m });
  }
};
