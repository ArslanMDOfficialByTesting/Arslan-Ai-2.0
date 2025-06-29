const config = require('../config.cjs');

const autorecordingCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);
  const prefix = config.PREFIX || '.';

  const fullCommand = m.body.startsWith(prefix) ? m.body.slice(prefix.length).trim() : '';
  const cmd = fullCommand.split(' ')[0]?.toLowerCase();
  const text = fullCommand.slice(cmd.length).trim().toLowerCase();

  if (cmd === 'autorecording') {
    if (!isCreator) {
      return m.reply("🚫 *Owner-only command!*");
    }

    let message;

    if (text === 'on') {
      config.AUTO_RECORDING = true;
      message = "🎙️ *Auto-Recording has been Enabled.*\nBot will now show recording status.";
    } else if (text === 'off') {
      config.AUTO_RECORDING = false;
      message = "⛔ *Auto-Recording has been Disabled.*\nBot will not show recording status.";
    } else {
      message = `🌩️ *Usage:*\n${prefix}autorecording on\n${prefix}autorecording off`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: message }, { quoted: m });
    } catch (error) {
      console.error("❌ Error in autorecordingCommand:", error);
      await Matrix.sendMessage(m.from, { text: '⚠️ Failed to process the request.' }, { quoted: m });
    }
  }
};

export default autorecordingCommand;
