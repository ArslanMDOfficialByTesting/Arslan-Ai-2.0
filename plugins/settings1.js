import moment from "moment-timezone";
import config from "../config.cjs"; // ✅ Fixed import line

const alive = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const pushName = m.pushName || 'User';
  const cmd = m.body.startsWith(prefix)
    ? m.body.slice(prefix.length).split(" ")[0].toLowerCase()
    : "";

  if (cmd === "settings") {
    await m.React('⚙️');

    const time = moment().tz("Asia/Karachi").format("HH:mm:ss");
    let greeting = "Good Night 🌌";
    if (time < "05:00:00") greeting = "Good Morning 🌄";
    else if (time < "11:00:00") greeting = "Good Morning 🌄";
    else if (time < "15:00:00") greeting = "Good Afternoon 🌅";
    else if (time < "19:00:00") greeting = "Good Evening 🌃";

    const settingsText = `Hello ${pushName} 👋\n${greeting}\n\n╭─❍「 *Bot Settings* 」❍
│ *Bot Name:* ${config.BOT_NAME}
│ *Prefix:* ${config.PREFIX}
│ *Session ID:* ${config.SESSION_ID}
│ *Auto Bio:* ${config.AUTO_BIO ? "Enabled" : "Disabled"}
│ *Auto Read:* ${config.AUTO_READ ? "Enabled" : "Disabled"}
│ *Auto React:* ${config.AUTO_REACT ? "Enabled" : "Disabled"}
│ *Auto Typing:* ${config.AUTO_TYPING ? "Enabled" : "Disabled"}
│ *Auto Sticker:* ${config.AUTO_STICKER ? "Enabled" : "Disabled"}
│ *Anti Link:* ${config.ANTILINK ? "Enabled" : "Disabled"}
│ *Anti Delete:* ${config.ANTI_DELETE ? "Enabled" : "Disabled"}
│ *Bot Mode:* ${config.MODE}
╰──────────────`;

    await Matrix.sendMessage(m.from, {
      text: settingsText,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
      }
    }, { quoted: m });
  }
};

export default alive;
