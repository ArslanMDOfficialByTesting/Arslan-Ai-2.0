const config = require('../config.cjs');

const autotypingCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);
  const prefix = config.PREFIX;

  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim().toLowerCase();

  if (cmd === 'autotyping') {
    if (!isCreator) return m.reply("🚫 *This command is only for the bot owner.*");

    let response;
    if (text === 'on') {
      config.AUTO_TYPING = true;
      response = "✍️ Auto-Typing has been *enabled*.";
    } else if (text === 'off') {
      config.AUTO_TYPING = false;
      response = "✍️ Auto-Typing has been *disabled*.";
    } else {
      response = `🌩️ *Usage:*\n${prefix}autotyping on\n${prefix}autotyping off`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: response }, { quoted: m });
      console.log("🔧 AUTO_TYPING set to:", config.AUTO_TYPING);
    } catch (err) {
      console.error("⚠️ Error in autotypingCommand:", err);
      await Matrix.sendMessage(m.from, { text: '⚠️ Error processing your request.' }, { quoted: m });
    }
  }
};

export default autotypingCommand;
