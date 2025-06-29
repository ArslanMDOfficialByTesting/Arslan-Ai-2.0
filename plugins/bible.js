const config = require('../config.cjs');
import fetch from 'node-fetch';

const bible = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "bible") {
    if (!text) {
      return await m.reply(`📖 Please specify a Bible reference.\n*Example:* ${prefix}bible John 3:16`);
    }

    const start = Date.now();
    await m.React('📖');

    try {
      const apiUrl = `https://bible-api.com/${encodeURIComponent(text)}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      const duration = Date.now() - start;

      if (data.error) {
        return await m.reply(`❌ Error: ${data.error}`);
      }

      if (data.text) {
        const formatted = `*📜 ${data.reference}*\n\n${data.text.trim()}\n\n_⏱️ Response Time: ${duration}ms_`;
        return await sock.sendMessage(m.from, { text: formatted }, { quoted: m });
      }

      await m.reply(`⚠️ Could not find the specified Bible reference.`);
    } catch (err) {
      console.error("❌ Bible Command Error:", err);
      await m.reply(`⚠️ An error occurred while fetching the verse.`);
    } finally {
      await m.React('✅');
    }
  }
};

export default bible;
