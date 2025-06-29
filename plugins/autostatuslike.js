import configModule from '../config.cjs';
const config = configModule.default || configModule;
;

const autolikeCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);
  const prefix = config.PREFIX || '.';

  const fullCommand = m.body.startsWith(prefix) ? m.body.slice(prefix.length).trim() : '';
  const cmd = fullCommand.split(' ')[0]?.toLowerCase();
  const text = fullCommand.slice(cmd.length).trim().toLowerCase();

  const validCommands = ['autolike', 'autoslike', 'autostatuslike'];

  if (validCommands.includes(cmd)) {
    if (!isCreator) return m.reply("🚫 *Owner-only command!*");

    let message;

    if (text === 'on') {
      config.AUTOLIKE_STATUS = true;
      message = `👍 *Auto Like Status Enabled.*\nBot will now react to contact statuses.`;
    } else if (text === 'off') {
      config.AUTOLIKE_STATUS = false;
      message = `❌ *Auto Like Status Disabled.*\nBot won't like statuses anymore.`;
    } else {
      message = `🌩️ *Usage:*\n${prefix + cmd} on\n${prefix + cmd} off`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: message }, { quoted: m });
    } catch (err) {
      console.error("❌ Error in autolikeCommand:", err);
      await Matrix.sendMessage(m.from, { text: '⚠️ Failed to process your request.' }, { quoted: m });
    }
  }
};

export default autolikeCommand;
