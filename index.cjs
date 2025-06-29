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
const { SESSION_ID, OWNER_NUMBER, PREFIX } = config;

const pluginDir = path.join(__dirname, 'plugins');
const plugins = {};

// 📁 Load plugins dynamically
fs.readdirSync(pluginDir).forEach((file) => {
  if (file.endsWith('.js')) {
    const plugin = require(path.join(pluginDir, file));
    if (plugin?.command && typeof plugin.handler === 'function') {
      plugins[plugin.command] = plugin.handler;
    }
  }
});

// 📦 Load saved session or download from MEGA
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

// 🚀 Start Bot
async function startBot() {
  const { state, saveCreds } = await useSession(SESSION_ID);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    printQRInTerminal: false,
    logger: pino({ level: 'silent' }),
    browser: ['Arslan-Ai', 'Safari', '1.0'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    }
  });

  sock.ev.on('creds.update', saveCreds);

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
      console.log('✅ Bot connected as:', sock.user.id);
      await sock.sendMessage(`${OWNER_NUMBER}@s.whatsapp.net`, {
        text: `✅ *Arslan-Ai 2.0 is now connected!*\n\n👑 Owner: wa.me/${OWNER_NUMBER}`
      });
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const text = msg.message?.conversation || msg.message[type]?.text || '';

    if (text.startsWith(PREFIX)) {
      const cmd = text.slice(PREFIX.length).trim().toLowerCase();
      if (plugins[cmd]) {
        try {
          await plugins[cmd](sock, msg, sender, text);
        } catch (err) {
          console.error(`❌ Error in ${cmd}:`, err);
          await sock.sendMessage(sender, { text: '❌ Command error.' }, { quoted: msg });
        }
      } else {
        await sock.sendMessage(sender, { text: `❌ Unknown command: *${cmd}*` }, { quoted: msg });
      }
    }
  });
}

startBot();
