const config = require('../config.cjs');

const autotypingCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);
  const prefix = config.PREFIX || '.';

  const fullCommand = m.body.startsWith(prefix) ? m.body.slice(prefix.length).trim() : '';
  const cmd = fullCommand.split(' ')[0]?.toLowerCase();
  const text = fullCommand.slice(cmd.length).trim().toLowerCase();

  // Allowed aliases
  const validCommands = ['chatbot', 'lydea', 'lydia', 'answer', 'automreply'];

  if (validCommands.includes(cmd)) {
    if (!isCreator) {
      return m.reply("👺 *Only the bot owner can use this command.*");
    }

    let message = '';
    const status = text === 'on' ? true : text === 'off' ? false : null;

    if (status === true) {
      config.CHAT_BOT = true;
      message = `✅ *${cmd.toUpperCase()} is now Enabled.*\nBot will auto-reply to messages.`;
    } else if (status === false) {
      config.CHAT_BOT = false;
      message = `🛑 *${cmd.toUpperCase()} is now Disabled.*\nBot won't auto-reply anymore.`;
    } else {
      message = `🌩️ *Usage:*\n${prefix}${cmd} on\n${prefix}${cmd} off`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: message }, { quoted: m });
    } catch (error) {
      console.error(`[❌ ERROR]:`, error);
      await Matrix.sendMessage(m.from, { text: '⚠️ Error while processing your request.' }, { quoted: m });
    }
  }
};

export default autotypingCommand;
