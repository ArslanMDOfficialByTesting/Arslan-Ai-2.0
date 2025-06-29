const fs = require('fs');
const path = require('path');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const config = require('./config.cjs');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  fetchLatestBaileysVersion,
  delay
} = require('@whiskeysockets/baileys');

const { SESSION_ID, OWNER_NUMBER } = config;

async function useSession(session_id) {
  const sessionPath = './auth_info';
  if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath);
  const file = `${sessionPath}/creds.json`;

  // If not exists, download from MEGA
  if (!fs.existsSync(file)) {
    const megaUrl = `https://mega.nz/file/${session_id.replace('ARSL~', '')}`;
    const { File } = require('megajs');
    const stream = File.fromURL(megaUrl).download();
    const output = fs.createWriteStream(file);
    stream.pipe(output);
    await new Promise(res => output.on('finish', res));
  }

  return await useMultiFileAuthState(sessionPath);
}

const startBot = async () => {
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

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("❌ Connection closed:", lastDisconnect?.error?.message);
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log("✅ Bot is connected as:", sock.user.id);
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const type = Object.keys(msg.message)[0];
    const text = msg.message?.conversation || msg.message[type]?.text || '';

    if (text.startsWith(config.PREFIX)) {
      const cmd = text.slice(config.PREFIX.length).trim().toLowerCase();

      switch (cmd) {
        case 'ping':
          await sock.sendMessage(sender, { text: '*Pong!* 🏓' }, { quoted: msg });
          break;

        case 'owner':
          await sock.sendMessage(sender, { text: `👑 My Owner: wa.me/${OWNER_NUMBER}` }, { quoted: msg });
          break;

        default:
          await sock.sendMessage(sender, { text: `❌ Unknown command: *${cmd}*` }, { quoted: msg });
      }
    }
  });
};

startBot();
