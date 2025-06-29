import configModule from '../config.cjs';
const config = configModule.default || configModule;

const autochatbot = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['chatbot', 'automreply', 'lydia', 'lydea'];

  if (validCommands.includes(cmd)) {
    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");

    let responseMessage;

    if (text === 'on') {
      config.CHAT_BOT = true;
      responseMessage = "✅ Chatbot enabled.";
    } else if (text === 'off') {
      config.CHAT_BOT = false;
      responseMessage = "❌ Chatbot disabled.";
    } else {
      responseMessage = "🌩️ Usage:\n- chatbot on\n- chatbot off";
    }

    await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
  }
};

export default autochatbot;
