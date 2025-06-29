import moment from 'moment-timezone';
import configModule from '../config.cjs';
const config = configModule.default || configModule;

const lifeQuotes = [
  "💖 The only way to do great work is to love what you do. ❤️‍🔥",
  "🌟 Strive not to be a success, but rather to be of ✨ value ✨. 💎",
  // ... other quotes
];

let bioUpdateInterval = null;

const autobio = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "autobio") {
    if (!sock.user?.id) {
      await sock.sendMessage(m.from, { text: '🤖 Bot info not available.' }, { quoted: m });
      return;
    }

    const updateBio = async () => {
      try {
        const sriLankaTime = moment().tz('Asia/Colombo').format('HH:mm:ss');
        const quote = lifeQuotes[Math.floor(Math.random() * lifeQuotes.length)];
        const newBio = `✨ KING-SANDESH-MD ACTIVE | 🕰️ Time: ${sriLankaTime} | 💬 "${quote}"`;

        await sock.updateProfileStatus(newBio);
        console.log("✅ Bio Updated:", newBio);
      } catch (err) {
        console.error("❌ Error updating bio:", err);
      }
    };

    if (bioUpdateInterval) {
      clearInterval(bioUpdateInterval);
      bioUpdateInterval = null;
      await sock.sendMessage(m.from, { text: '⛔ Bio update stopped.' }, { quoted: m });
    } else {
      await updateBio();
      bioUpdateInterval = setInterval(updateBio, 60000);
      await sock.sendMessage(m.from, { text: '✅ Auto bio started.' }, { quoted: m });
    }
  }
};

export default autobio;
