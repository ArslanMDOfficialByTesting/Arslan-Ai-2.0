const config = require('../config.cjs');

const block = async (m, gss) => {
  try {
    const botNumber = await gss.decodeJid(gss.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd !== 'block') return;
    if (!isCreator) return m.reply("*📛 THIS IS AN OWNER COMMAND*");

    let target;

    // Priority: Mentioned user > Quoted message > Raw number
    if (m.mentionedJid && m.mentionedJid[0]) {
      target = m.mentionedJid[0];
    } else if (m.quoted) {
      target = m.quoted.sender;
    } else if (text.match(/^\d{7,}$/)) {
      target = `${text.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
    } else {
      return m.reply("❌ Please mention a user, quote a message, or provide a number.");
    }

    await gss.updateBlockStatus(target, 'block');
    await m.reply(`✅ Successfully blocked @${target.split('@')[0]}`, { mentions: [target] });

  } catch (error) {
    console.error('❌ Block Command Error:', error);
    await m.reply('⚠️ An error occurred while processing the block command.');
  }
};

export default block;
