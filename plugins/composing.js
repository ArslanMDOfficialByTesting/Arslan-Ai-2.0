const config = require('../config.cjs');

const handleCommand = async (m, gss) => {
  try {
    const from = m.from;
    const sender = m.sender || '';

    // ✍️ Auto Typing
    if (config.AUTO_TYPING && from) {
      gss.sendPresenceUpdate('composing', from);
    }

    // 🎙️ Auto Recording
    if (config.AUTO_RECORDING && from) {
      gss.sendPresenceUpdate('recording', from);
    }

    // 🟢 Always Online OR Unavailable
    if (from) {
      const presence = config.ALWAYS_ONLINE ? 'available' : 'unavailable';
      gss.sendPresenceUpdate(presence, from);
    }

    // 📖 Auto Read
    if (config.AUTO_READ && m.key) {
      await gss.readMessages([m.key]);
    }

    // 🚫 Auto Block Morocco (+212)
    if (config.AUTO_BLOCK && sender.startsWith('212')) {
      await gss.updateBlockStatus(sender, 'block');
      console.log(`🚫 Auto-blocked: ${sender}`);
    }

  } catch (err) {
    console.error("❌ Error in handleCommand:", err);
  }
};

export default handleCommand;
