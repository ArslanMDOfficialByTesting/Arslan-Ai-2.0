import configModule from '../config.cjs';
const config = configModule.default || configModule;

const autoreactCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);
  const prefix = config.PREFIX || '.';

  const fullCommand = m.body.startsWith(prefix) ? m.body.slice(prefix.length).trim() : '';
  const cmd = fullCommand.split(' ')[0]?.toLowerCase();
  const text = fullCommand.slice(cmd.length).trim().toLowerCase();

  if (cmd === 'autoreact') {
    if (!isCreator) return m.reply("🚫 *This is an owner-only command.*");

    let message;
    const status = text === 'on' ? true : text === 'off' ? false : null;

    if (status === true) {
      config.AUTO_REACT = true;
      message = "✅ *AUTO_REACT is now Enabled.*\nBot will now auto-react to messages.";
    } else if (status === false) {
      config.AUTO_REACT = false;
      message = "🛑 *AUTO_REACT is now Disabled.*\nBot will not react to messages.";
    } else {
      message = `🌩️ *Usage:*\n${prefix}autoreact on\n${prefix}autoreact off`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: message }, { quoted: m });
    } catch (error) {
      console.error("❌ Error:", error);
      await Matrix.sendMessage(m.from, { text: '⚠️ Failed to process the request.' }, { quoted: m });
    }
  }
};

export default autoreactCommand;
