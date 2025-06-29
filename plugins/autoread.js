import configModule from '../config.cjs';
const config = configModule.default || configModule;

const autoreadCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);
  const prefix = config.PREFIX || '.';

  const fullCommand = m.body.startsWith(prefix) ? m.body.slice(prefix.length).trim() : '';
  const cmd = fullCommand.split(' ')[0]?.toLowerCase();
  const text = fullCommand.slice(cmd.length).trim().toLowerCase();

  if (cmd === 'autoread') {
    if (!isCreator) {
      return m.reply("🚫 *Owner-only command!*");
    }

    let message;

    if (text === 'on') {
      config.AUTO_READ = true;
      message = "✅ *Auto-Read has been Enabled.*\nBot will now auto-mark messages as read.";
    } else if (text === 'off') {
      config.AUTO_READ = false;
      message = "🛑 *Auto-Read has been Disabled.*\nBot will not mark messages as read.";
    } else {
      message = `🌩️ *Usage:*\n${prefix}autoread on\n${prefix}autoread off`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: message }, { quoted: m });
    } catch (error) {
      console.error("❌ Error in autoreadCommand:", error);
      await Matrix.sendMessage(m.from, { text: '⚠️ Failed to process the request.' }, { quoted: m });
    }
  }
};

export default autoreadCommand;
