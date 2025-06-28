import dotenv from 'dotenv';
dotenv.config();

import unzipper from 'unzipper';
import fs from 'fs';
import path from 'path';
import pino from 'pino';
import express from 'express';
import chalk from 'chalk';
import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, Browsers } from '@whiskeysockets/baileys';
import config from './config.cjs';

// ⬇️ Paths
const sessionDir = path.join('./session');
const credsPath = path.join(sessionDir, 'creds.json');
const app = express();
const PORT = process.env.PORT || 3000;

let useQR = false;
let initialConnection = true;

// 🧠 Extract session from base64 zip
async function extractSessionFromEnv() {
  const encoded = config.SESSION_ID?.split("ARSL~")[1];
  if (!encoded) {
    console.error("❌ Invalid SESSION_ID format");
    return false;
  }

  try {
    const buffer = Buffer.from(encoded, 'base64');
    await fs.promises.mkdir(sessionDir, { recursive: true });

    await unzipper.Open.buffer(buffer)
      .then((d) => d.extract({ path: sessionDir, concurrency: 5 }));

    console.log("✅ Session extracted successfully.");
    return true;
  } catch (err) {
    console.error("❌ Failed to extract session:", err);
    return false;
  }
}

async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: useQR,
      browser: Browsers.macOS('Safari'),
      version,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
      if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        console.log('Reconnecting...');
        startBot();
      } else if (connection === 'open') {
        console.log(chalk.green("✅ Connected to WhatsApp successfully!"));
        initialConnection = false;
      }
    });

    // Add more events here like messages.upsert etc...

  } catch (err) {
    console.error("❌ Critical bot error:", err);
    process.exit(1);
  }
}

async function init() {
  if (fs.existsSync(credsPath)) {
    console.log("🔐 Session already exists. Starting...");
    await startBot();
  } else {
    const extracted = await extractSessionFromEnv();
    if (extracted) {
      await startBot();
    } else {
      useQR = true;
      console.log("⚠️ No session found. Showing QR for pairing...");
      await startBot();
    }
  }
}

init();

// Express app (optional)
app.get('/', (_, res) => res.send('Arslan-Ai-2.0 is live 🚀'));
app.listen(PORT, () => console.log(`🌐 Bot running on port ${PORT}`));
