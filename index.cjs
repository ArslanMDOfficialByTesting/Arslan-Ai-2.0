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

async function startBot() {
  const { state, saveCreds } = await useSession(config.SESSION_ID);
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
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
  const msg = messages[0];
  console.log("📥 New Message Received:", JSON.stringify(msg, null, 2));

  if (!msg.message || msg.key.fromMe) {
    console.log("⛔ Message has no content or from me. Skipping.");
    return;
  }

  const sender = msg.key.remoteJid;
  const type = Object.keys(msg.message)[0];
  const text = msg.message?.conversation || msg.message[type]?.text || '';

  console.log("📤 Text:", text);

  if (text.startsWith(config.PREFIX)) {
    const cmd = text.slice(config.PREFIX.length).trim().toLowerCase();
    console.log("🔍 Command received:", cmd);

    switch (cmd) {
      case 'ping':
        await sock.sendMessage(sender, { text: '*Pong!* 🏓' }, { quoted: msg });
        break;

      case 'owner':
        await sock.sendMessage(sender, { text: `👑 My Owner: wa.me/${config.OWNER_NUMBER}` }, { quoted: msg });
        break;

      default:
        await sock.sendMessage(sender, { text: `❌ Unknown command: *${cmd}*` }, { quoted: msg });
    }
} else {
    console.log("❌ Message does not start with prefix:", config.PREFIX);
  }
  });

}

startBot();
