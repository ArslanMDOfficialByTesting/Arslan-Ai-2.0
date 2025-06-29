const config = require('../config.cjs');
import moment from 'moment-timezone';

// ✨ Colorful Life Quotes ✨
const lifeQuotes = [
  "💖 The only way to do great work is to love what you do. ❤️‍🔥",
  "🌟 Strive not to be a success, but rather to be of ✨ value ✨. 💎",
  "🧠 The mind is everything. What you think 💭 you become. 🔮",
  "🚀 Believe you can and you're halfway there! 🏆",
  "🌌 The future belongs to those who believe in the beauty of their dreams. 🦢",
  "⏳ It is never too late to be what you might have been. 🦋💫",
  "💥 Do not wait to strike till the iron is hot; but 🔥 make 🔥 the iron hot by striking! ⚡",
  "🎨 The best way to predict the future is to ✍️ create ✍️ it. 🌈",
  "🚶‍♂️ The journey of a thousand miles begins with a ✨ single ✨ step. 🏞️👣",
  "😊 Happiness is not something readymade. It comes from your own actions. 😄🌟",
  "❰❰ 🖤 𝐀ʟ𝐖ᴀ𝐘ꜱ 𝙺𝐈𝙽𝙂 𝐈𝗡 🆃🅷🅴 𝐆𝙰ₘₑ 💦 ❱❱",
  "😏 I am the Artist Who Paints My Life ✋"
];

let bioUpdateInterval = null;

const autobio = async (m, sock) => {
  const prefix = config.PREFIX || '.';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "autobio") {
    if (!sock.user?.id) {
      return await sock.sendMessage(m.from, { text: '🤖 Bot info unavailable. Try again later.' }, { quoted: m });
    }

    const updateBio = async () => {
      try {
        const time = moment().tz('Asia/Colombo').format('HH:mm:ss'); // Change to 'Asia/Karachi' for 🇵🇰
        const quote = lifeQuotes[Math.floor(Math.random() * lifeQuotes.length)];
        const newBio = `✨ 𝐀ʀꜱʟᴀɴ-𝐀ɪ 𝐈ꜱ 𝐀ᴄᴛɪᴠᴇ 🟢 | 🕰️ Time: ${time} 🇱🇰 | 💬 ${quote}`;
        await sock.updateProfileStatus(newBio);
        console.log('[✅ Bio Updated]', newBio);
      } catch (err) {
        console.error('[❌ Bio Update Failed]', err);
      }
    };

    if (bioUpdateInterval) {
      clearInterval(bioUpdateInterval);
      bioUpdateInterval = null;
      return await sock.sendMessage(m.from, { text: '😴 Automatic bio updates have been stopped.' }, { quoted: m });
    } else {
      await updateBio(); // First run immediately
      bioUpdateInterval = setInterval(updateBio, 60000); // every 1 min
      return await sock.sendMessage(m.from, { text: '✨ Automatic bio updates started! Magic activated.' }, { quoted: m });
    }
  }
};

export default autobio;
