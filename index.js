import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import pino from 'pino';
import express from 'express';
import chalk from 'chalk';
import { 
  makeWASocket, 
  useMultiFileAuthState, 
  fetchLatestBaileysVersion, 
  DisconnectReason, 
  Browsers 
} from '@whiskeysockets/baileys';
import config from './config.cjs';

// Paths
const sessionDir = path.join('./session');
const credsPath = path.join(sessionDir, 'creds.json');
const app = express();
const PORT = process.env.PORT || 3000;

let useQR = false;

// WhatsApp Connection
async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: useQR,
      browser: Browsers.macOS('Safari'), // Same as pair.js
      version,
      markOnlineOnConnect: true,
      syncFullHistory: false,
      getMessage: async (key) => ({ conversation: 'Arslan-AI-2.0' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) useQR = true; // Show QR if needed
      
      if (connection === 'open') {
        console.log(chalk.green('✅ WhatsApp Connected!'));
        console.log(chalk.blue(`User ID: ${sock.user?.id || 'Unknown'}`));
      }

      if (connection === 'close') {
        if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
          console.log(chalk.yellow('🔄 Reconnecting...'));
          setTimeout(startBot, 5000);
        } else {
          console.log(chalk.red('❌ Logged out, please rescan QR'));
          process.exit(1);
        }
      }
    });

    // Add your message handlers here
    // sock.ev.on('messages.upsert', ...)

  } catch (err) {
    console.error(chalk.red('❌ Bot error:'), err);
    process.exit(1);
  }
}

// Main Init
async function init() {
  try {
    if (fs.existsSync(credsPath)) {
      console.log(chalk.blue('🔐 Using existing session...'));
      await startBot();
    } else if (config.SESSION_ID) {
      console.log(chalk.blue('🔍 Loading session from config...'));
      await loadSession();
      await startBot();
    } else {
      useQR = true;
      console.log(chalk.yellow('⚠️ No session found, showing QR...'));
      await startBot();
    }
  } catch (err) {
    console.error(chalk.red('❌ Init failed:'), err);
  }
}

// Session Loader
async function loadSession() {
  try {
    const sessionData = Buffer.from(config.SESSION_ID.split('ARSL~')[1], 'base64');
    await fs.promises.mkdir(sessionDir, { recursive: true });
    await fs.promises.writeFile(credsPath, sessionData);
    console.log(chalk.green('✅ Session loaded!'));
    return true;
  } catch (err) {
    console.error(chalk.red('❌ Session load failed:'), err);
    return false;
  }
}

// Start
init();

// Express Server
app.get('/', (_, res) => res.send('Arslan-AI-2.0 Online 🚀'));
app.listen(PORT, () => console.log(chalk.blue(`🌐 Server running on port ${PORT}`)));
