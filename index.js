import dotenv from 'dotenv';
dotenv.config();

import {
  makeWASocket,
  Browsers,
  fetchLatestBaileysVersion,
  DisconnectReason,
  useMultiFileAuthState
} from '@whiskeysockets/baileys';

import express from 'express';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { File } from 'megajs';

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_DIR = path.join('./session');
const CREDS_FILE = path.join(SESSION_DIR, 'creds.json');

const MAIN_LOGGER = pino({ timestamp: () => `,"time":"${new Date().toJSON()}"` });
const logger = MAIN_LOGGER.child({});
logger.level = 'silent';

if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

const downloadSessionData = async () => {
  const sessionID = process.env.SESSION_ID || '';
  const trimmed = sessionID.split("ARSL~")[1];

  if (!trimmed || !trimmed.includes("#")) {
    console.error('❌ Invalid SESSION_ID format. Example: ARSL~FILEID#KEY');
    return false;
  }

  const [fileId, key] = trimmed.split("#");

  try {
    const file = File.fromURL(`https://mega.nz/file/${fileId}#${key}`);
    const data = await new Promise((resolve, reject) => {
      file.download((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    await fs.promises.writeFile(CREDS_FILE, data);
    console.log('✅ Session loaded from MEGA.');
    return true;
  } catch (err) {
    console.error('❌ Error downloading session from MEGA:', err.message);
    return false;
  }
};

const startBot = async () => {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      browser: Browsers.macOS('Safari'),
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false
    });

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
      if (connection === 'open') {
        console.log(chalk.green('✅ Bot connected successfully.'));
      } else if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log(chalk.red('❌ Connection closed. Reconnecting:', shouldReconnect));
        if (shouldReconnect) startBot();
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
      const msg = messages[0];
      if (!msg.message || msg.key.fromMe) return;

      const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
      console.log(chalk.yellow(`📩 Message from ${msg.key.remoteJid}: ${text}`));

      await sock.sendMessage(msg.key.remoteJid, { text: `🤖 Hello! You said: "${text}"` });
    });

  } catch (err) {
    console.error('❌ Failed to start bot:', err.message);
    process.exit(1);
  }
};

const init = async () => {
  if (fs.existsSync(CREDS_FILE)) {
    console.log('🔒 Session found. Starting bot...');
    await startBot();
  } else {
    const success = await downloadSessionData();
    if (success) await startBot();
    else {
      console.log('⚠️ Session could not be loaded. Please check SESSION_ID.');
      process.exit(1);
    }
  }
};

app.get('/', (req, res) => {
  res.send('🤖 ArslanMD Bot Running!');
});

app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
  init();
});
