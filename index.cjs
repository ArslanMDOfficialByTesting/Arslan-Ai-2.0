const fs = require('fs');
const path = require('path');
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const megajs = require('megajs');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const config = require('./config.cjs');
const { SESSION_ID, PREFIX } = config;

const pluginDir = path.join(__dirname, 'plugins');
const plugins = {};

// ✅ Load all plugins dynamically
fs.readdirSync(pluginDir).forEach((file) => {
  if (file.endsWith('.js')) {
    const plugin = require(path.join(pluginDir, file));
    if (plugin?.command && typeof plugin.handler === 'function') {
      plugins[plugin.command] = plugin.handler;
    }
  }
});

// 📦 Load session from MEGA (ARSL~)
async function useSession(session_id) {
  const sessionPath = './auth_info';
  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath);
  const file = `${sessionPath}/creds.json`;

  if (!fs.existsSync(file)) {
    const megaUrl = `https://mega.nz/file/${session_id.replace('ARSL~', '')}`;
    const fileInstance = megajs.File.fromURL(megaUrl);
    const stream = fileInstance.download();
    const output = fs.createWriteStream(file);
    stream.pipe(output);
    await new Promise((res) => output.on('finish', res));
  }

  return await useMultiFileAuthState(sessionPath);
}

// 🌐 START BOT
async function startBot() {
  const { state, saveCreds } = await useSession(SESSION_ID);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: ['Arslan-Ai-2.0', 'Chrome', '1.0'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    }
  });

  sock.ev.on('creds.update', saveCreds);

  let OWNER_NUMBER = ''; // Dynamic owner

  sock.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error?.output?.statusCode || 0) !== DisconnectReason.loggedOut;
      console.log("❌ Connection closed:", lastDisconnect?.error?.message || '');
      if (shouldReconnect) {
        console.log("🔁 Reconnecting...");
        await startBot();
      }
    } else if (connection === 'open') {
      OWNER_NUMBER = sock.user.id.split('@')[0];
      console.log(`✅ Bot connected as: ${sock.user.id}`);

      await sock.sendMessage(`${OWNER_NUMBER}@s.whatsapp.net`, {
        text: `✅ *Arslan-Ai 2.0 is now connected!*\n\n👑 *Dynamic Owner:* wa.me/${OWNER_NUMBER}`
      });
    }
  });

  // ✅ Message Handler
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const sender = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const text = msg.message?.conversation || msg.message[type]?.text || '';

    // ✅ Auto React
    if (config.AUTO_REACT && !msg.key.fromMe) {
      try {
        await sock.sendMessage(msg.key.remoteJid, {
          react: {
            text: config.AUTOLIKE_EMOJI || '❤️',
            key: msg.key
          }
        });
      } catch (e) {
        console.log('⚠️ Auto React Error:', e);
      }
    }

    // ✅ Commands
    if (text.startsWith(PREFIX)) {
      const command = text.slice(PREFIX.length).split(' ')[0].toLowerCase();
      if (plugins[command]) {
        try {
          await plugins[command](sock, msg, sender, text, `${OWNER_NUMBER}@s.whatsapp.net`);
        } catch (err) {
          console.error(`❌ Error in ${command}:`, err);
          await sock.sendMessage(sender, { text: '❌ Command error.' }, { quoted: msg });
        }
      } else {
        await sock.sendMessage(sender, { text: `❌ Unknown command: *${command}*` }, { quoted: msg });
      }
    }
  });

  // ✅ Auto Status Seen
  sock.ev.on('presence.update', async (update) => {
    if (!config.AUTO_STATUS_SEEN) return;
    try {
      const id = update?.id;
      if (id && id.endsWith('@status.whatsapp.net')) {
        await sock.readMessages([id]);
        console.log(`👀 Auto seen status: ${id}`);
      }
    } catch (e) {
      console.log('⚠️ Auto Status Seen Error:', e);
    }
  });
}

startBot();

// ✅ Render HTTP Keep-Alive
const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => res.end("Arslan-Ai 2.0 is running")).listen(PORT, () =>
  console.log(`🌐 HTTP Server running on port ${PORT}`)
);
