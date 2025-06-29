import configModule from '../config.cjs';
const config = configModule.default || configModule;


const autostatusCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, `${config.OWNER_NUMBER}@s.whatsapp.net`].includes(m.sender);
  const prefix = config.PREFIX;

  const [cmd, ...args] = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(/\s+/) : [''];
  const text = args.join(' ').trim().toLowerCase();

  const validCommands = ['autostatus', 'autosview', 'autostatusview'];

  if (validCommands.includes(cmd)) {
    if (!isCreator) return m.reply("🚫 *This command is only for the bot owner.*");

    let message;
    if (text === 'on') {
      config.AUTO_STATUS_SEEN = true;
      message = "👁️ *Auto Status Seen has been enabled.*\nBot will now automatically view contact statuses.";
    } else if (text === 'off') {
      config.AUTO_STATUS_SEEN = false;
      message = "❌ *Auto Status Seen has been disabled.*";
    } else {
      message = `🌩️ *Usage:*\n${prefix + cmd} on\n${prefix + cmd} off`;
    }

    try {
      await Matrix.sendMessage(m.from, { text: message }, { quoted: m });
      console.log("✅ AUTO_STATUS_SEEN:", config.AUTO_STATUS_SEEN);
    } catch (err) {
      console.error("⚠️ Error in autostatusCommand:", err);
      await Matrix.sendMessage(m.from, { text: '⚠️ Failed to process your request.' }, { quoted: m });
    }
  }
};

export default autostatusCommand;
